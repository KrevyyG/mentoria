import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'

type EnvelopeErro = {
  erro: {
    codigo: string
    mensagem: string
  }
}

const CODIGO_POR_STATUS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'validacao',
  [HttpStatus.UNAUTHORIZED]: 'nao_autorizado',
  [HttpStatus.FORBIDDEN]: 'nao_autorizado',
  [HttpStatus.NOT_FOUND]: 'nao_encontrado',
  [HttpStatus.CONFLICT]: 'conflito',
}

@Catch()
export class ExcecaoGlobalFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExcecaoGlobalFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const { status, codigo, mensagem } = this.extrair(exception)

    if (status >= 500) {
      this.logger.error(exception)
    }

    const corpo: EnvelopeErro = { erro: { codigo, mensagem } }
    response.status(status).json(corpo)
  }

  private extrair(exception: unknown): {
    status: number
    codigo: string
    mensagem: string
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const resp = exception.getResponse()
      const mensagem = this.mensagemDe(resp) ?? exception.message
      const codigo = CODIGO_POR_STATUS[status] ?? 'erro'
      return { status, codigo, mensagem }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      codigo: 'erro_interno',
      mensagem: 'Erro inesperado no servidor',
    }
  }

  private mensagemDe(resp: string | object): string | undefined {
    if (typeof resp === 'string') return resp
    const obj = resp as { message?: string | string[] }
    if (Array.isArray(obj.message)) return obj.message[0]
    if (typeof obj.message === 'string') return obj.message
    return undefined
  }
}
