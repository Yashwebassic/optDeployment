import {  Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/user.module';
import { LocalStrategy } from './localStrategy';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [UsersModule, PassportModule, EmailModule,
    JwtModule.register({
      secret: jwtConstants.secret, 
      signOptions: { expiresIn: '10800s' },
    }), 
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
