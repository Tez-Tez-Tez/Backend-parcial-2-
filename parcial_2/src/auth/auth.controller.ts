import { Body, Controller, Post, Req,Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { register } from 'module';
import { UsuarioCreateDTO } from '../usuarios/dto/usuarios.dto';
import { LoginDTO } from './dto/login.dto';
import { Roles } from './decorators/roles.decorator';
import { JwtGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor (private readonly authSer:AuthService ){}

    @Post()
        async register(@Body()dto:UsuarioCreateDTO){
            return this.authSer.register(dto);
        }

    @Post('/login')
    async login(@Body()dto:LoginDTO){
        return this.authSer.login(dto)
    }
    @UseGuards(JwtGuard)
    @Get('/perfil')
    async perfil(@Req()req:any){
        return await this.authSer.perfil(req.user)
    }
}

