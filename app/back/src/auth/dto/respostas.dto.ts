import { ApiProperty } from '@nestjs/swagger'

export class UsuarioDto {
  @ApiProperty({ format: 'uuid' })
  id!: string

  @ApiProperty({ example: 'pessoa@exemplo.com' })
  email!: string
}

export class RespostaLoginDto {
  @ApiProperty({ description: 'JWT Bearer para usar em Authorization' })
  token!: string

  @ApiProperty({ type: UsuarioDto })
  usuario!: UsuarioDto
}
