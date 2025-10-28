import { IsEmail, IsOptional, IsString } from "class-validator";

export class LoginDTO {

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @IsString()
  password!: string;
}