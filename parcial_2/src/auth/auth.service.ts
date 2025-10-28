import { BadRequestException,UnauthorizedException,Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuarios/entity/usuarios.entity';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { UsuarioCreateDTO } from '../usuarios/dto/usuarios.dto';
import * as bcrypt from 'bcryptjs'
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService : JwtService,private usuarioSer : UsuariosService){}

    async register(dto:UsuarioCreateDTO):Promise<UsuarioEntity>{
        try {
            const correoExists = await this.usuarioSer.email(dto.email)
            if(correoExists){
                throw new BadRequestException('Correo en uso por otro usuario')
            }

            const nickNameExists = await this.usuarioSer.nickName(dto.nombreUsuario)
            if(nickNameExists){
                throw new BadRequestException('Nickname en uso por otro usuario')
            }

            const salt = await bcrypt.genSalt(10)
            dto.password = await bcrypt.hash(dto.password,salt)
            const user = await this.usuarioSer.crear(dto)
            return user;
        } catch (error) {
            throw error;
        }
    }

async login(dto: LoginDTO) {
  try {
    if (!dto.email && !dto.nombreUsuario) {
      throw new BadRequestException('Debes enviar email o nombreUsuario para loguearte');
    }

    const user = dto.email 
      ? await this.usuarioSer.email(dto.email)
      : await this.usuarioSer.nickName(dto.nombreUsuario!);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.estado !== 'activo') {
      throw new UnauthorizedException('Tu cuenta está inactiva. Contacta al administrador.');
    }

    const credencialesValidas = await bcrypt.compare(dto.password, user.password);
    if (!credencialesValidas) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    const payload = {
      id: user.id,
      rol: user.rol,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        nombreUsuario: user.nombreUsuario,
        rol: user.rol,
      }
    };

  } catch (error) {
    throw error;
  }
}

async perfil(user:any){
  try{
  const perfilUser = await this.usuarioSer.perfil(user.id)
  if(!perfilUser){
    throw new NotFoundException('Errror al obtener perfil')
  }

  const {password,...perfil}= perfilUser;
  return {perfil: perfil}
}catch(error){
  throw error;
}
}
}


