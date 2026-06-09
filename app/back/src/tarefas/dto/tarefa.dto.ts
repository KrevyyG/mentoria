import { ApiProperty } from '@nestjs/swagger'

export class TarefaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string

  @ApiProperty({ example: 'Comprar pão' })
  titulo!: string

  @ApiProperty({ example: false })
  concluida!: boolean

  @ApiProperty({ format: 'uuid', nullable: true })
  categoria_id!: string | null

  @ApiProperty({ format: 'date-time' })
  criado_em!: string
}
