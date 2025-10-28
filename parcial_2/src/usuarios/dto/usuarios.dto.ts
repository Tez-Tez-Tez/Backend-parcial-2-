import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Estado, Roles } from "../entity/usuarios.entity";

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
    @IsNotEmpty()
    @IsEnum(Roles)
    rol?: Roles;
}

export class UsuarioUpdateDTO{
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(3)
    nombre?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(3)
    apellido?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(3)
    nombreUsuario?: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsEnum(Estado)
    @IsNotEmpty()
    @IsOptional()
    estado?: Estado;

    @IsEnum(Roles)
    @IsNotEmpty()
    @IsOptional()
    rol?:Roles;
}