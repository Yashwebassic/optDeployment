import { Body, Controller, Get, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/user.forgotPassword.dto';
import { ResetPasswordDto } from './dto/user.resetPassword.dto';
import { JwtAuthGuard } from './jwt-auth.guards';
import { LocalAuthGuard } from './local-auth.guard';


@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

   @UseGuards(LocalAuthGuard)  
   @Post('auth/login')
   async login(@Request() req) {
     return this.authService.login(req.user);
   }     

    @UseGuards(JwtAuthGuard)
    @Get('profile') 
    getProfile(@Request() req){ 
      return req.user; 
    }

      @Post('forgot')
      async forgotPassword(@Body() forgotDto: ForgotPasswordDto) {
        // console.log(forgotDto)
        return this.authService.forgotPassword(forgotDto);
      }
    
      @Patch('reset')
      async resetPassword(@Body() resetDto: ResetPasswordDto) {
       
        return this.authService.resetPassword(resetDto);
      }
    }
    




