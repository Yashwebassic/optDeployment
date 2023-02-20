import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';

import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { SmsService } from 'src/sms/sms.service';
import { OtpEventDto } from './otp-event-log.dto';
import { OptEvent } from './otp-event-log.entity';
import { OptEventService } from './otp-event-log.service';



@Controller('optEventLog')
export class OptEventController {
  constructor(
    private readonly optEventService: OptEventService,
    private readonly smsServcie:SmsService
    ) {}

  @Post('/create')
  create(@Body() createOptEventLog: OtpEventDto) {
    console.log(createOptEventLog)
    this.smsServcie.sendSms(createOptEventLog)
    return this.optEventService.create(createOptEventLog);
  }


 

  
  @Get()
  @UseGuards(JwtAuthGuard)
  public findAll(@Paginate() query:PaginateQuery):Promise<Paginated<OptEvent>>{  
    return this.optEventService.findAll(query);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optEventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() optEventLogDto: OtpEventDto) {
    return this.optEventService.update(+id, optEventLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optEventService.remove(+id);
  }
}
