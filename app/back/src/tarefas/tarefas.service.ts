import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto'
import { CriarTarefaDto } from './dto/criar-tarefa.dto'
import { FiltrarTarefasDto } from './dto/filtrar-tarefas.dto'
import { TarefaDto } from './dto/tarefa.dto'

type LinhaTarefa = {
  id: string
  titulo: string
  concluida: boolean
  categoriaId: string | null
  criadoEm: Date
}

function paraDto(t: LinhaTarefa): TarefaDto {
  return {
    id: t.id,
    titulo: t.titulo,
    concluida: t.concluida,
    categoria_id: t.categoriaId,
    criado_em: t.criadoEm.toISOString(),
  }
}

@Injectable()
export class TarefasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(
    usuarioId: string,
    filtros: FiltrarTarefasDto = {},
  ): Promise<TarefaDto[]> {
    if (filtros.categoria_id && filtros.sem_categoria) {
      throw new BadRequestException(
        'Use categoria_id ou sem_categoria, não ambos',
      )
    }

    const where: {
      usuarioId: string
      concluida?: boolean
      categoriaId?: string | null
    } = { usuarioId }

    if (filtros.concluida !== undefined) where.concluida = filtros.concluida
    if (filtros.categoria_id) where.categoriaId = filtros.categoria_id
    if (filtros.sem_categoria) where.categoriaId = null

    const tarefas = await this.prisma.tarefa.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
    })
    return tarefas.map(paraDto)
  }

  async criar(usuarioId: string, dto: CriarTarefaDto): Promise<TarefaDto> {
    const categoriaId = dto.categoria_id ?? null
    if (categoriaId) {
      const dona = await this.prisma.categoria.findFirst({
        where: { id: categoriaId, usuarioId },
        select: { id: true },
      })
      if (!dona) {
        throw new NotFoundException('Categoria não encontrada')
      }
    }
    const tarefa = await this.prisma.tarefa.create({
      data: {
        titulo: dto.titulo,
        usuarioId,
        categoriaId,
      },
    })
    return paraDto(tarefa)
  }

  async atualizar(
    usuarioId: string,
    id: string,
    dto: AtualizarTarefaDto,
  ): Promise<TarefaDto> {
    const resultado = await this.prisma.tarefa.updateMany({
      where: { id, usuarioId },
      data: { concluida: dto.concluida },
    })
    if (resultado.count === 0) {
      throw new NotFoundException('Tarefa não encontrada')
    }
    const tarefa = await this.prisma.tarefa.findUniqueOrThrow({
      where: { id },
    })
    return paraDto(tarefa)
  }

  async excluir(usuarioId: string, id: string): Promise<void> {
    const resultado = await this.prisma.tarefa.deleteMany({
      where: { id, usuarioId },
    })
    if (resultado.count === 0) {
      throw new NotFoundException('Tarefa não encontrada')
    }
  }
}
