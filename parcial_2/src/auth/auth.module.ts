import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuarios/entity/usuarios.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports:[
    PassportModule,
    TypeOrmModule.forFeature([UsuarioEntity]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async(config : ConfigService)=>({
        secret: config.get('config.jwt'),
        signOptions: {expiresIn:'1h'}
      })
    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService,UsuariosService,JwtStrategy]
})
export class AuthModule {}
