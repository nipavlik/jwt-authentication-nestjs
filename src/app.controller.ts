import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard'
import { Public } from './auth/common/public-auth.guard'
import { User } from './auth/common/user.decorator'

@Controller()
export class AppController {

  @Public()
  @Get('/public')
  publicRoute(): string {
    return 'Public route'
  }

  @UseGuards(JwtAuthGuard)
  @Get('/private')
  privateRoute(@User() user): string {
    return `Private route: Hello ${user.username}`
  }
}
