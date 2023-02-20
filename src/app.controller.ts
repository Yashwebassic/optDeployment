import { Controller, Get, Post, Request, UseGuards, Query, Body, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guards';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Device } from './device/device.entity';
import { DeviceService } from './device/device.service';
import { ExcelService } from './excel/excel.service';
import { OtpEventDto } from './otp-event-log/otp-event-log.dto';
import { OptEventService } from './otp-event-log/otp-event-log.service';
import { SmsService } from './sms/sms.service';
import { User } from './users/user.entity';
import { UsersService } from './users/user.service';
const aesModule = require('../build/Release/aes.node')


class TextLocalMsg {
  sender: string;
  inNumber: string;
  content: string;
  keyword: string;
}

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly deviceService: DeviceService,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
    private readonly optEventService: OptEventService,
    private readonly excelService: ExcelService
  ) { }
  //@UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    // return req.user
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  getAuthCode(@Query('reqCode') reqCode: string): string {
    console.log("req:", reqCode)
    return aesModule.generateAuthCode(parseInt(reqCode));
  }

  @Post('textlocal')
  async textlocalHook(
    @Request() req: Request,
    @Body() msg: TextLocalMsg,
    @Query() query) {
    console.log('body', req.body);
    console.log('msg', msg);
    console.log('query', query);
    let reqCode = msg.content.replace(msg.keyword, '').trim();
    console.log('reqCode', reqCode);
    // validate if mobile no is valid/active
    const user: User = await this.usersService.findUserByMobileNo(msg.sender);
    // extract serial no and also generate OTP
    let authCodeRes = aesModule.generateAuthCode(parseInt(reqCode));

    console.log("authcode", authCodeRes);
    if (!(user && user.status === 'Active')) {
      console.log(`No active user with mobile/alt mobile no: ${msg.sender} found.`);
      const optEvent: OtpEventDto = {
        name: `Unknown: ${msg.sender}`,
        mobile: msg.sender,
        email: "",
        deviceSerialNo: authCodeRes.serial_number,
        otpResponse: "Failed: Request from unknown person",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        otpStatus: "Failed",
        rqstForResponse: "upgrade"
      }
      this.optEventService.create(optEvent);
      return;
    }
    console.log(`find device ${authCodeRes.serial_number}`);
    const device: Device = await this.deviceService.findDeviceBySerialNo(parseInt(authCodeRes.serial_number));
    if (!(device && device.status === 'Active')) {
      console.log(`No active device with serial no: ${authCodeRes.serial_number} found.`);
      const optEvent: OtpEventDto = {
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        deviceSerialNo: authCodeRes.serial_number,
        otpResponse: "Failed: Invalid device serial no",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        otpStatus: "Failed",
        rqstForResponse: "upgrade"
      }
      this.optEventService.create(optEvent);
      this.smsService.sendSMS(msg.sender, authCodeRes.auth_code);
      return;
    }

    // reply with SMS only when req is for active device and valid mobile number
    this.smsService.sendOTP(msg.sender, authCodeRes.auth_code);
    const optEvent: OtpEventDto = {
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      deviceSerialNo: device.serialNo,
      otpResponse: "Success",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      otpStatus: "Success",
      rqstForResponse: "upgrade"
    }
    this.optEventService.create(optEvent);
    return;
  }

  @Get('excel/download')
  @UseGuards(JwtAuthGuard)
  async downloadExcel(@Query() query: any, @Res() res: Response) {
    // console.log(query);
    console.log(query.model);
    let data = [];
    if (query.model === 'user') {
      data = await this.usersService.findByQuery(query);
    }
    else if (query.model === 'otp') {
      console.log("query.model");
      console.log(query.model);

      data = await this.optEventService.findByQueryEvent(query)
    }
    else if (query.model === 'device') {
      data = await this.deviceService.findByQueryDevice(query)
    } else {
      return res.status(400).send('Invalid model specified');
    }
    console.log(data)
    const filename = 'MyExcelSheet.xlsx';
    const file = await this.excelService.downloadExcel(data);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.sendFile(file);
  }

  @Get('sendQuery')
  async findByQuery(
    @Query() query: string,
  ): Promise<any> {
    return this.usersService.findByQuery(query)
  }

}