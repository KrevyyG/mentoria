import { ApiProperty } from '@nestjs/swagger'

export class CategoriaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string

  @ApiProperty({ example: 'Trabalho' })
  nome!: string

  @ApiProperty({ format: 'date-time' })
  criado_em!: string
}
