import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';

@Module({

  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
