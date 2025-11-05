import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Estado, Roles } from "../entity/usuarios.entity";
import { EmptyToUndefined } from "../../common/decorators/empty-to-undefined.decorator";

export class UsuarioCreateDTO{

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    apellido!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    nombreUsuario!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
    
    @IsOptional()
    @IsEnum(Roles)
    rol?: Roles;
}

export class UsuarioUpdateDTO{
    @EmptyToUndefined()
    @IsString()
    @IsOptional()
    @MinLength(3)
    nombre?: string;

    @IsString()
    @EmptyToUndefined()
    @IsOptional()
    @MinLength(3)
    apellido?: string;

    @IsString()
    @EmptyToUndefined()
    @IsOptional()
    @MinLength(3)
    nombreUsuario?: string;

    @IsEmail()
    @EmptyToUndefined()
    @IsOptional()
    email?: string;

    @IsString()
    @EmptyToUndefined()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsEnum(Estado)
    @IsOptional()
    estado?: Estado;

    @IsEnum(Roles)
    @IsOptional()
    rol?:Roles;
}