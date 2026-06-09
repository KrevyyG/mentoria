import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegistroDto {
  @ApiProperty({ example: 'pessoa@exemplo.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string

  @ApiProperty({ minLength: 6, example: 'senha-forte-aqui' })
  @IsString()
  @MinLength(6, { message: 'A senha precisa de pelo menos 6 caracteres' })
  senha!: string
}
