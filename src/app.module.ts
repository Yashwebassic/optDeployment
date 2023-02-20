import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/user.module';
import { DeviceModule } from './device/device.module';
import * as dotenv from "dotenv";
import { OtpeventModule } from './otp-event-log/otp-event-log.module';
import { SmsModule } from './sms/sms.module';
// import { OptEventLogModule } from './opt-event-log/opt-event-log.module';
import { ExcelModule } from './excel/excel.module';
import { join } from 'path';


dotenv.config();

console.log(process.env.PORT)


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      // password: '',// we didn't have setup password on our local mysql-workbench
      database: 'demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),AuthModule, EmailModule, SmsModule, DeviceModule, OtpeventModule, UsersModule,ExcelModule
  ],
// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: process.env.DB_HOST ,
//       port: parseInt(process.env.DB_PORT, 10),
//       username: process.env.DB_USERNAME || 'root',
//       password: process.env.DB_PASSWORD || 'Pass1234',
//       database: process.env.DB_DATABASE || 'hecotp',
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true,
//     }),AuthModule, EmailModule, SmsModule, DeviceModule, OtpeventModule, UsersModule,ExcelModule
//   ],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService]
  
})
export class AppModule {}
