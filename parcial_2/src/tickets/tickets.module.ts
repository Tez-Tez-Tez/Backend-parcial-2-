import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsEntity } from './entity/tickets.entity';
import { UsuarioEntity } from '../usuarios/entity/usuarios.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports:[TypeOrmModule.forFeature([TicketsEntity,UsuarioEntity]), MailModule],
  controllers: [TicketsController],
  providers: [TicketsService]
})
export class TicketsModule {}
