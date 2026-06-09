import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsUUID } from 'class-validator'

function paraBoolean(valor: unknown): unknown {
  if (valor === undefined || valor === null) return undefined
  if (valor === 'true' || valor === true) return true
  if (valor === 'false' || valor === false) return false
  // valor inválido — devolve original para o @IsBoolean rejeitar
  return valor
}

export class FiltrarTarefasDto {
  @ApiPropertyOptional({
    description: 'Filtra por situação',
    enum: ['true', 'false'],
  })
  @IsOptional()
  @Transform(({ value }) => paraBoolean(value))
  @IsBoolean()
  concluida?: boolean

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  categoria_id?: string

  @ApiPropertyOptional({ description: 'Quando true, lista as sem categoria' })
  @IsOptional()
  @Transform(({ value }) => paraBoolean(value))
  @IsBoolean()
  sem_categoria?: boolean
}
