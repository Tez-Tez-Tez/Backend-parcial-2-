import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entity/usuarios.entity';
import { Repository } from 'typeorm';
import { UsuarioCreateDTO } from './dto/usuarios.dto';

@Injectable()
export class UsuariosService {
    constructor(@InjectRepository(UsuarioEntity)private usuarioRepo : Repository<UsuarioEntity>){}
    
    async crear(dto:UsuarioCreateDTO){
        const newuser = await this.usuarioRepo.create(dto);
        const user = await this.usuarioRepo.save(newuser)
        return user;
    }

    async getId (id:number){
        try{
        const user = await this.usuarioRepo.findOne({where:{id},relations:['tickets']})
        if(!user){
            throw new NotFoundException('No se encontro al usuario')
        }
        if(user.tickets.length===0){
            return {...user,tickets:'No tienes tickets realizados'}
        }
        return user;
    } catch(error){
        throw error;
    }
    }

    async email(email:string){
        const correo = await this.usuarioRepo.findOneBy({email})
        return correo;
    }

    async nickName(nombreUsuario:string){
        const nickName = await this.usuarioRepo.findOneBy({nombreUsuario})
        return nickName;
    }

    async perfil(id:number){
        return await this.usuarioRepo.findOne({where:{id}})
    }
}
