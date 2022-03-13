import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { UserModule } from '../user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { LocalStrategy } from './local/local.strategy'
import { JwtStrategy } from './jwt/jwt.strategy'
import { RefreshSession } from './entities/refreshSession.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    UserModule, 
    PassportModule,
    JwtModule.register({
      secret: 'secret'
    }),
    TypeOrmModule.forFeature([RefreshSession])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
