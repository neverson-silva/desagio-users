import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInputDto {
  @ApiProperty({ description: 'Nome do usuário', required: false })
  @IsString({ message: 'O nome do usuário deve ser uma string' })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Email do usuário', required: false })
  @IsEmail({}, { message: 'O email do usuário deve ser um email' })
  @IsOptional()
  email?: string;
}
