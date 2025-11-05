import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entity/usuarios.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity]), MailModule],
  controllers: [UsuariosController],
  providers: [UsuariosService]
})
export class UsuariosModule {}
