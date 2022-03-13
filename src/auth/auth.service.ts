import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { SignOptions } from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { ConfigService } from '@nestjs/config'

import { UserService } from '../user/user.service'
import { RefreshSession } from './entities/refreshSession.entity'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(RefreshSession) 
    private sessionRepository: Repository<RefreshSession>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username)

    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    
    return null
  }

  async login(user: any) {
    
    const accessToken = await this.generateAccessToken({ id: user.id, username: user.username })
    const refreshToken = await this.generateRefreshToken({ id: user.id })
    
    await this.createRefreshSession(user.id, refreshToken)

    return {
      user,
      accessToken,
      refreshToken
    }
  }

  async createRefreshSession(userId: any, token: string) {
    const session = new RefreshSession()

    const decodeToken: any = this.jwtService.decode(token)

    session.user = userId
    session.refreshToken = token
    session.expiresIn = decodeToken.exp
    session.createdAt = decodeToken.iat

    return await this.sessionRepository.save(session)
  }

  async generateAccessToken(payload: { id: number, username: string }): Promise<string> {
    const opts: SignOptions = {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRESIN'),
      subject: String(payload.id)
    }

    return this.jwtService.signAsync({
      username: payload.username,
      sid: nanoid() // token uniqueness
    }, opts)
  }

  async generateRefreshToken(payload: { id: number }): Promise<string> {
    const opts: SignOptions = {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRESIN'),
      subject: String(payload.id)
    }

    return this.jwtService.signAsync({
      sid: nanoid() // token uniqueness
    }, opts)
  }

  async refreshToken(token: string) {

    try {
      var decodeToken: any = this.jwtService.verify(token)
    } catch(err) {
      throw new UnauthorizedException()
    }

    let user: User = await this.userService.getUserById(decodeToken.sub)

    let session: RefreshSession = await this.sessionRepository.findOne({ where: { refreshToken: token } })
    if(!session) throw new UnauthorizedException()

    const accessToken = await this.generateAccessToken({ id: user.id, username: user.username })
    const refreshToken = await this.generateRefreshToken({ id: user.id })

    const decodeNewToken: any = this.jwtService.decode(refreshToken)
    
    session.createdAt = decodeNewToken.iat
    session.expiresIn = decodeNewToken.exp
    session.refreshToken = refreshToken

    await this.sessionRepository.save(session)

    return {
      user,
      accessToken,
      refreshToken
    }
  }

}