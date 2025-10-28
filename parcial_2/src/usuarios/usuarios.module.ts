import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entity/usuarios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [UsuariosService]
})
export class UsuariosModule {}
