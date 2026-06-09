import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'pessoa@exemplo.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string

  @ApiProperty({ example: 'senha-forte-aqui' })
  @IsString()
  @IsNotEmpty({ message: 'Informe a senha' })
  senha!: string
}
