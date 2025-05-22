import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInputDto {
  @ApiProperty({ description: 'Nome de usuário único' })
  @IsString({ message: 'O nome de usuário deve ser uma string' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  @MinLength(3, {
    message: 'O nome de usuário deve ter no mínimo 3 caracteres',
  })
  @MaxLength(30, {
    message: 'O nome de usuário deve ter no máximo 40 caracteres',
  })
  username: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsString({ message: 'O email deve ser uma string' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser um email válido' })
  email: string;
}
