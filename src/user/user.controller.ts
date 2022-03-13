import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'

import { CreateUserDto } from './dto/CreateUser.dto'
import { UpdateUserDto } from './dto/UpdateUser.dto'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Controller()
export class UserController {
    
  constructor(
    private userService: UserService
  ) {}
  
  @Get('/users')
  async getUsers(): Promise<User[]> {
    return await this.userService.getAllUsers()
  }

  @Get('/user/:id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getUserById(id)
  }

  @Post('/user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto)
  }

  @Delete('/user/:id')
  async removeUser(@Param('id') id: number) {
    return await this.userService.removeUser(id)
  }

  @Put('/user/:id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto)
  }

}