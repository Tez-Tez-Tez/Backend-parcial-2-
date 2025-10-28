import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector : Reflector){}

    canActivate(context: ExecutionContext): boolean{
        const lista = this.reflector.get<string[]>('roles',context.getHandler())

        if(!lista){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(!lista.includes(user.rol)){
            throw new ForbiddenException('No tienes permisos para acceder a esta ruta')
        }

        return true;
    }
}