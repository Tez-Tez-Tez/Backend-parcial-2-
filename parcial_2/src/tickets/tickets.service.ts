import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estado, TicketsEntity } from './entity/tickets.entity';
import { Repository } from 'typeorm';
import { TicketsCreateDTO, TicketsUpdateDTO } from './dto/tickets.dto';
import { UsuarioEntity } from '../usuarios/entity/usuarios.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TicketsService {
    private readonly logger = new Logger(TicketsService.name);
    constructor(@InjectRepository(TicketsEntity)private ticketSer : Repository<TicketsEntity>,
@InjectRepository(UsuarioEntity)private userSer : Repository<UsuarioEntity>,
private mailService: MailService){}

    async create (dto:TicketsCreateDTO,id: number){
        try{
        if(!dto){
            throw new BadRequestException('Debes emviar los campos requeridos')
        }
        const user = await this.userSer.findOne({where:{id}})
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
        const ticket = await this.ticketSer.findOne({
            where: {id},
            relations: ['usuario'],
            select: {
                usuario: {
                    id: true,
                    email: true,
                    nombreUsuario: true
                }
            }
        });
        
        if(!ticket){
            throw new NotFoundException('Error al obtener el ticket')
        }

        if(user.rol !== 'admin' && ticket.usuario.id !== user.id){
            throw new ForbiddenException('No puedes actulizar tickets de otros usuarios')
        }

                const update = await this.ticketSer.preload({
                    id,
                    ...dto,
                    usuario: ticket.usuario
                });
                
                if(!update){
                        throw new BadRequestException('Error al actualizar ticket')
                }
                
                this.logger.debug(`Datos del ticket antes de guardar: ${JSON.stringify({
                    id: update.id,
                    estado: dto.estado,
                    usuario: update.usuario
                })}`);
                
                const saved = await this.ticketSer.save(update);

                try{
                    this.logger.debug(`Usuario del ticket: ${JSON.stringify(saved.usuario)}`);
                    if(dto.estado && dto.estado !== ticket.estado && saved.usuario?.email){
                        this.logger.debug(`Intentando enviar correo a ${saved.usuario.email} para el ticket ${saved.id}`);
                        this.logger.debug(`Contexto del correo: ${JSON.stringify({ 
                            ticketId: saved.id, 
                            estado: dto.estado, 
                            detalle: saved.descripcion,
                            nombreUsuario: saved.usuario?.nombreUsuario 
                        })}`);
                        await this.mailService.sendTicketChange(saved.usuario.email, { 
                            ticketId: saved.id, 
                            estado: dto.estado, 
                            detalle: saved.descripcion,
                            nombreUsuario: saved.usuario?.nombreUsuario 
                        });
                    } else {
                        this.logger.debug(`No se envía correo: estado=${dto.estado}, estadoAnterior=${ticket.estado}, tieneEmail=${!!saved.usuario?.email}`);
                    }
                }catch(err){
                    this.logger.warn('No se pudo enviar el mail de actualización del ticket.', err);
                    if (err instanceof Error) {
                        this.logger.warn('Detalles del error:', err.message);
                    }
                }

                return saved;
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
                        const saved = await this.ticketSer.save(cerrado);

                        try{
                            if(saved.usuario?.email){
                                await this.mailService.sendTicketChange(saved.usuario.email, { ticketId: saved.id, estado: saved.estado, descripcion: saved.descripcion, nombreUsuario: saved.usuario?.nombreUsuario });
                            }
                        }catch(err){
                            this.logger.warn('No se pudo enviar el email de cierre del ticket.', err as any);
                        }

                        return {message:'Ticket cerrado'}
        } catch (error) {
            throw error;
        }
    }

}
