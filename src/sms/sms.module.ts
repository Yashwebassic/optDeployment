import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
 
  providers: [SmsService],
  exports:[SmsService]
})
export class SmsModule{}
