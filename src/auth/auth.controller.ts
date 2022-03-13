import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { User } from './common/user.decorator'
import { RefreshDto } from './dto/Refresh.dto'
import { LocalAuthGuard } from './local/local-auth.guard'

@Controller()
export class AuthController {

  constructor(private authService: AuthService) {}
  
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@User() user) {
    return await this.authService.login(user)
  }

  @Post('auth/refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refreshToken(refreshDto.refreshToken)
  }

}