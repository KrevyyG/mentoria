import { ApiProperty } from '@nestjs/swagger'

export class EnvelopeErroDto {
  @ApiProperty({ example: 'validacao' })
  codigo!: string

  @ApiProperty({ example: 'O título não pode ser vazio' })
  mensagem!: string
}

export class RespostaErroDto {
  @ApiProperty({ type: EnvelopeErroDto })
  erro!: EnvelopeErroDto
}
