import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estado, TicketsEntity } from './entity/tickets.entity';
import { Repository } from 'typeorm';
import { TicketsCreateDTO, TicketsUpdateDTO } from './dto/tickets.dto';
import { UsuarioEntity } from '../usuarios/entity/usuarios.entity';

@Injectable()
export class TicketsService {
    constructor(@InjectRepository(TicketsEntity)private ticketSer : Repository<TicketsEntity>,
@InjectRepository(UsuarioEntity)private userSer : Repository<UsuarioEntity>){}

    async create (dto:TicketsCreateDTO){
        try{
        if(!dto){
            throw new BadRequestException('Debes emviar los campos requeridos')
        }
        const user = await this.userSer.findOne({where:{id:dto.id_usuario}})
        if(!user){
            throw new NotFoundException('El usuario no existe')
        }
        const ticket = await this.ticketSer.create({...dto,usuario:user})
        return await this.ticketSer.save(ticket);
    } catch (error){
        throw error;
    }
    }
    
    async getAll(){
         try{
        const tickets = await this.ticketSer.find({relations:['usuario']});
        if(!tickets){
            throw new BadRequestException('No hay tickets creados')
        }

        return tickets;
    }catch(error){
        throw error;
    }
    }

    async getOne(id:number,user:any){
        try{
        const ticket = await this.ticketSer.findOne({where:{id},relations:['usuario']})
        if(!ticket){
            throw new NotFoundException('El ticket no existe')
        }

        if(user.rol !== 'admin' && ticket.usuario.id !== user.id){
            throw new ForbiddenException('No puedes ver las reservas de otros')
        }

        return ticket;
    }catch(error){
        throw error;
    }
    }

    async misTickets(user:any){
        try{
        const usuario = await this.userSer.findOne({where:{id:user.id}})
        if(!usuario){
            throw new NotFoundException('Error al obtener el usuario')
        }
        const tickets = await this.ticketSer.find({where:{usuario:{id:usuario.id}}})
        if(tickets.length ===0){
            return {message:'No tienes tickets aún'}
        }

        return tickets;
    }catch(error){
        throw error;
    }
    }

    async update(id:number,dto:TicketsUpdateDTO,user: any){
        try{
        const ticket = await this.ticketSer.findOne({where:{id},relations:['usuario']})
        if(!ticket){
            throw new NotFoundException('Error al obtener el ticket')
        }

        if(user.rol !== 'admin' && ticket.usuario.id !== user.id){
            throw new ForbiddenException('No puedes actulizar tickets de otros usuarios')
        }

        const update = await this.ticketSer.preload({id,...dto})
        if(!update){
            throw new BadRequestException('Error al actualizar ticket')
        }
        return await this.ticketSer.save(update);
    }catch(error){
        throw error;
    }
    }

    async delete(id:number,user : any){
        try {
            const ticket = await this.ticketSer.findOne({where:{id},relations:['usuario']})
            if(!ticket){
                throw new NotFoundException('Error al obtener el ticket')
            }

            if(user.rol !== 'admin' && ticket.usuario.id !== user.id){
                throw new ForbiddenException('No puedes eliminar tickets de otras personas')
            }

            const eliminar = await this.ticketSer.remove(ticket);
            if(!eliminar){
                throw new BadRequestException('No se pudo eliminar el ticket')
            }

            return {message:'Ticket eliminado exitosamente'}
        } catch (error) {
            throw error;
        }
    }

    async cerrarTickets(id:number,user:any){
        try {
            const ticket = await this.ticketSer.findOne({where:{id},relations:['usuario']})
            if(!ticket){
                throw new NotFoundException('No se encontro el ticket')
            }

            if(user.rol !=='admin' && ticket.usuario.id !== user.id){
                throw new ForbiddenException('No puedes cerrar tickets de otros usuarios')
            }

            const cerrado = await this.ticketSer.preload({id,estado:Estado.cerrado})
            if(!cerrado){
                throw new BadRequestException('Error al cerrar ticket')
            }
            await this.ticketSer.save(cerrado);
            return {message:'Ticket cerrado'}
        } catch (error) {
            throw error;
        }
    }

}
