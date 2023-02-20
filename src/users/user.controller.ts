import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserForgotPasswordDto } from './dto/user.forgotpassword.dto';
import { UserChangePasswordDto } from './dto/userChangePasswordDto';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { SmsService } from 'src/sms/sms.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ModuleRef } from '@nestjs/core';
import { UserGetOptDto } from './dto/user.getOtpDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';


@Controller('user')
export class UserController {
  constructor(
    private moduleRef: ModuleRef,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
    ) { }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public findtById(@Param('id') userId: number) {
    return this.usersService.findUserById(userId);
  } 

    @Get('')
    @UseGuards(JwtAuthGuard)
  public listAll(@Paginate() query:PaginateQuery):Promise<Paginated<User>>{
    return this.usersService.listAll(query);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() usersData: User): Promise<any> {
    return this.usersService.create(usersData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    const newCat: any = await this.usersService.update(id, body)
    return "user updated";
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.usersService.delete(id)
    return "user deleted"
  }

 
  @Post('forgotpassword')
  async forgotPassword(@Body() usersData: UserForgotPasswordDto): Promise<any> {
    return this.usersService.forgotPassword(usersData)
  }


  @Patch('setpassword')
  async changePassword(@Param('id') id, @Body() usersData: UserChangePasswordDto): Promise<any> {
    return this.usersService.changePassword(id, usersData)
  }

  
  @Post('sms')
  async smsSend(@Body() usersData: UserGetOptDto): Promise<any> {
    const getuser = await this.usersService.smsSend(usersData);
     let smsRes = this.smsService.sendSms(getuser)
     
     let d = {"smsResponse": smsRes }
   
  } 
 

}

