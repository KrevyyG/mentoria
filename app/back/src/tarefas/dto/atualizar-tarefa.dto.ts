import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class AtualizarTarefaDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  concluida!: boolean
}
