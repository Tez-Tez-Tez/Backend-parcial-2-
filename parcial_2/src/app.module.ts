import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration'
import {TypeOrmModule} from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    UsuariosModule,
    TicketsModule,
    ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:'.env',
    load:[configuration]
    }),
    TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: (config : ConfigService)=>{
      const port = config.get('config.db.port')
      console.log(`Puerto de la db es ${port}`)
      return{
          type: 'mysql',
          port: port,
          host: config.get('config.db.host'),
          username: config.get('config.db.user'),
          database: config.get('config.db.name'),
          password: config.get('config.db.password'),
          connectorPackage: 'mysql2',
          synchronize: false,
          entities: [__dirname +'/**/*.entity{.ts,.js}'],
          logging:false
      }
    }
    }),
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
