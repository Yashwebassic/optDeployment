
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; //By using this dependancy we inject dep.. that is jwtService
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/user.service';
import *as moment from 'moment'
import * as bcrypt from 'bcrypt'
import { ForgotPasswordDto } from './dto/user.forgotPassword.dto';
import { ResetPasswordDto } from './dto/user.resetPassword.dto';

@Injectable() /*tells Nest this class is a provider*/
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService, // jwt provide service
    private readonly emailService: EmailService//---------email
  ) {}

  async validateUser(username: any, password: any): Promise<any> {
    const user = await this.userService.findOne(username);
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch === true) {
        return user
      }
      return null
    } catch (error) {
    }
  }

  async login(user: any) {
    const payload = { username: user.username, userId: user.userId };
    const jwtToken = this.jwtService.sign(payload)
    await this.userService.update(user.id, { "token": jwtToken })
    return {
      status: '200',
      name: user.name,
      role: user.role,
      sub: user.id,
      time: moment().add(3, 'm').calendar(),
      access_token: jwtToken,
    };
  }


  async forgotPassword(requestObj: any) {
    const { email } = requestObj;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = { userEmail: user.email, userId: user.id, };
    const generateResetToken = await this.jwtService.sign(payload)
    const { id } = user;
    await this.userService.update(id, { 'resetToken': generateResetToken });
    let mailDetails = {
      from: 'health.tech108@gmail.com',//set from env
      to: user.email,
      subject: "Forgot Password link to reset your password",
      text: ` http://localhost:3000/resetpassword/${generateResetToken}`
    };
    let resetLink = await this.emailService.sendMail(mailDetails);
    return { message: 'Password reset link sent' };
  }


  async resetPassword(requestObj: ResetPasswordDto) {   
    const { token, password } = requestObj;
    
    const user = await this.userService.findUserByToken({ resetToken: requestObj.token });

    if (!user) {
      throw new BadRequestException('Invalid token');
    }
    const { id } = user
    const hash = await bcrypt.hash(password, 10);
  
    await this.userService.update(id, { 'password': hash, resetToken: null });  

    return { message: 'Password reset successful' };
  }


}

