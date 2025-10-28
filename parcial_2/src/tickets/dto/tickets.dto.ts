import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Estado, Prioridad } from "../entity/tickets.entity";

export class TicketsCreateDTO{
        @IsString()
        @IsNotEmpty()
        asunto!: string;
    
        @IsNotEmpty()
        @IsString()
        descripcion!: string;
    
        @IsNotEmpty()
        @IsEnum(Prioridad)
        prioridad!: Prioridad;
    
        @IsInt()
        @IsNotEmpty()
        id_usuario!: number;
}

export class TicketsUpdateDTO{
        @IsString()
        @IsNotEmpty()
        @IsOptional()
        asunto?: string;
    
        @IsNotEmpty()
        @IsString()
        @IsOptional()
        descripcion?: string;
    
        @IsNotEmpty()
        @IsOptional()
        @IsEnum(Prioridad)
        prioridad?: Prioridad;
    
        @IsNotEmpty()
        @IsEnum(Estado)
        @IsOptional()
        estado?: Estado;
}