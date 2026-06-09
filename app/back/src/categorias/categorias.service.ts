import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CriarCategoriaDto } from './dto/criar-categoria.dto'
import { CategoriaDto } from './dto/categoria.dto'

type LinhaCategoria = {
  id: string
  nome: string
  criadoEm: Date
}

function paraDto(c: LinhaCategoria): CategoriaDto {
  return {
    id: c.id,
    nome: c.nome,
    criado_em: c.criadoEm.toISOString(),
  }
}

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(usuarioId: string): Promise<CategoriaDto[]> {
    const categorias = await this.prisma.categoria.findMany({
      where: { usuarioId },
      orderBy: { nome: 'asc' },
    })
    return categorias.map(paraDto)
  }

  async criar(
    usuarioId: string,
    dto: CriarCategoriaDto,
  ): Promise<CategoriaDto> {
    const existe = await this.prisma.categoria.findUnique({
      where: { usuarioId_nome: { usuarioId, nome: dto.nome } },
      select: { id: true },
    })
    if (existe) {
      throw new ConflictException('Já existe uma categoria com esse nome')
    }
    const categoria = await this.prisma.categoria.create({
      data: { usuarioId, nome: dto.nome },
    })
    return paraDto(categoria)
  }

  async excluir(usuarioId: string, id: string): Promise<void> {
    const resultado = await this.prisma.categoria.deleteMany({
      where: { id, usuarioId },
    })
    if (resultado.count === 0) {
      throw new NotFoundException('Categoria não encontrada')
    }
  }
}
