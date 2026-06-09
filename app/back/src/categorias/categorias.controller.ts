import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator'
import { RespostaErroDto } from '../common/swagger/respostas-erro'
import { CategoriasService } from './categorias.service'
import { CategoriaDto } from './dto/categoria.dto'
import { CriarCategoriaDto } from './dto/criar-categoria.dto'

@ApiTags('categorias')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categorias: CategoriasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar minhas categorias (HU-04)' })
  @ApiResponse({ status: 200, type: CategoriaDto, isArray: true })
  @ApiResponse({
    status: 401,
    description: 'Sem token ou token inválido',
    type: RespostaErroDto,
  })
  listar(@UsuarioAtual() usuarioId: string) {
    return this.categorias.listar(usuarioId)
  }

  @Post()
  @ApiOperation({ summary: 'Criar categoria (HU-03)' })
  @ApiResponse({ status: 201, type: CategoriaDto })
  @ApiResponse({
    status: 400,
    description: 'Nome em branco',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Sem token ou token inválido',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe uma categoria com esse nome para o usuário',
    type: RespostaErroDto,
  })
  criar(
    @UsuarioAtual() usuarioId: string,
    @Body() dto: CriarCategoriaDto,
  ) {
    return this.categorias.criar(usuarioId, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir categoria (HU-04)',
    description:
      'Tarefas que usavam a categoria ficam sem categoria (categoria_id = null). Não são apagadas.',
  })
  @ApiResponse({ status: 204, description: 'Excluída' })
  @ApiResponse({
    status: 401,
    description: 'Sem token ou token inválido',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não existe ou pertence a outro usuário',
    type: RespostaErroDto,
  })
  excluir(
    @UsuarioAtual() usuarioId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.categorias.excluir(usuarioId, id)
  }
}
