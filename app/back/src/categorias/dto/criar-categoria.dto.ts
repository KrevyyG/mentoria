import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsString, MinLength } from 'class-validator'

export class CriarCategoriaDto {
  @ApiProperty({ example: 'Trabalho' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1, { message: 'O nome não pode ser vazio' })
  nome!: string
}
