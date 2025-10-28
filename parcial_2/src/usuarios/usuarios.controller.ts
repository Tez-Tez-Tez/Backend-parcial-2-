import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('usuarios')
@UseGuards(JwtGuard,RolesGuard)
export class UsuariosController {
    constructor(private readonly usuarioSer : UsuariosService){}

    @Roles('admin')
    @Get(':id')
    async getUser(@Param('id',ParseIntPipe)id:number){
        return this.usuarioSer.getId(id)
    }
}
