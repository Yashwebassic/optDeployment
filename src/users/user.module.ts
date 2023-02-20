import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { SmsModule } from 'src/sms/sms.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Module({
  imports:[TypeOrmModule.forFeature([User]), EmailModule, SmsModule],
  controllers:[UserController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}