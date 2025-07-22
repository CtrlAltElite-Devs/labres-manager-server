import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckPidDto } from './dto/check-pid.dto';
import { LoginDto } from './dto/login-dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() request: LoginDto){

  }

  @Post("admin/login")
  adminLogin(@Body() request: AdminLoginDto){

  }

  @Post("admin/register")
  adminRegister(@Body() request: AdminRegisterDto){

  }

  @Get("me")
  me(){

  }


  @Post("check-pid")
  checkPid(@Body() request: CheckPidDto){
    const {pid} = request;
    return pid;
  }

  @Put("update-user")
  updateUser(){
    
  }
}
