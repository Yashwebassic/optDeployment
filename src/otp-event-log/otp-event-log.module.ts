import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsModule } from 'src/sms/sms.module';
import { OptEventController } from './otp-event-log.controller';
import { OptEvent } from './otp-event-log.entity';
import { OptEventService } from './otp-event-log.service';

@Module({
  imports:[TypeOrmModule.forFeature([OptEvent]),SmsModule],
  controllers: [OptEventController],
  providers: [OptEventService],
  exports: [OptEventService]
})
export class OtpeventModule {}
