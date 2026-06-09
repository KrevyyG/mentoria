import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator'

export class CriarTarefaDto {
  @ApiProperty({ example: 'Comprar pão' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1, { message: 'O título não pode ser vazio' })
  titulo!: string

  @ApiProperty({
    required: false,
    nullable: true,
    format: 'uuid',
    description: 'Categoria opcional; ausente ou null = sem categoria',
  })
  @IsOptional()
  @IsUUID('4', { message: 'categoria_id inválido' })
  categoria_id?: string | null
}
