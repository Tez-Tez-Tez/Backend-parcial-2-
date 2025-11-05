import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EmptyToUndefined } from "../../common/decorators/empty-to-undefined.decorator";

export class LoginDTO {

  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}