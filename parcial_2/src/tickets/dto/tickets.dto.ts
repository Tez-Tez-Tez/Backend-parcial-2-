import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Estado, Prioridad } from "../entity/tickets.entity";
import { EmptyToUndefined } from "../../common/decorators/empty-to-undefined.decorator";

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

}

export class TicketsUpdateDTO{
        @IsString()
        @IsNotEmpty()
        @IsOptional()
        @EmptyToUndefined()
        asunto?: string;
    
        @IsNotEmpty()
        @IsString()
        @IsOptional()
        @EmptyToUndefined()
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