import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsCreateDTO, TicketsUpdateDTO } from './dto/tickets.dto';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tickets')
@UseGuards(JwtGuard,RolesGuard)
export class TicketsController {
    constructor(private readonly service : TicketsService){}

    @Post()
    async create(@Body()dto:TicketsCreateDTO,@Req()req: any){
        return this.service.create(dto,req.user.id)
    }

    @Get()
    @Roles('admin')
    async getAll(){
        return this.service.getAll();
    }

    @Get('/mis-tickets')
    async misTickets(@Req()req:any){
        return await this.service.misTickets(req.user);
    }

    @Get('/cerrar-tickets/:id')
    async cerrar(@Param('id',ParseIntPipe)id:number,@Req()req:any){
        return await this.service.cerrarTickets(id,req.user)
    }

    @Get(':id')
    @Roles('admin','user')
    async getOne(@Param('id',ParseIntPipe)id:number,@Req()req:any){
        return this.service.getOne(id,req.user);
    }

    @Patch(':id')
    async update(@Param('id',ParseIntPipe)id:number,@Body()dto:TicketsUpdateDTO,@Req()req:any){
        return await this.service.update(id,dto,req.user)
    }

    @Delete(':id')
    async delete(@Param('id')id:number,@Req()req:any){
        return await this.service.delete(id,req.user)
    }

}
