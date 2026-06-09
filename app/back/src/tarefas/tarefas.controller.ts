import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto'
import { CriarTarefaDto } from './dto/criar-tarefa.dto'
import { FiltrarTarefasDto } from './dto/filtrar-tarefas.dto'
import { TarefaDto } from './dto/tarefa.dto'
import { TarefasService } from './tarefas.service'

@ApiTags('tarefas')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefas: TarefasService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar minhas tarefas (HU-06, HU-08)',
    description:
      'Filtros opcionais via query string. categoria_id e sem_categoria são mutuamente exclusivos (400 se ambos vierem).',
  })
  @ApiResponse({ status: 200, type: TarefaDto, isArray: true })
  @ApiResponse({
    status: 400,
    description: 'Filtros conflitantes ou inválidos',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Sem token ou token inválido',
    type: RespostaErroDto,
  })
  listar(
    @UsuarioAtual() usuarioId: string,
    @Query() filtros: FiltrarTarefasDto,
  ) {
    return this.tarefas.listar(usuarioId, filtros)
  }

  @Post()
  @ApiOperation({ summary: 'Criar tarefa (HU-05)' })
  @ApiResponse({ status: 201, type: TarefaDto })
  @ApiResponse({
    status: 400,
    description: 'Título em branco ou categoria_id inválido',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Sem token ou token inválido',
    type: RespostaErroDto,
  })
  criar(
    @UsuarioAtual() usuarioId: string,
    @Body() dto: CriarTarefaDto,
  ) {
    return this.tarefas.criar(usuarioId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Concluir ou desmarcar tarefa (HU-07)' })
  @ApiResponse({ status: 200, type: TarefaDto })
  @ApiResponse({
    status: 400,
    description: 'concluida deve ser boolean',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Sem token ou token inválido',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não existe ou pertence a outro usuário',
    type: RespostaErroDto,
  })
  atualizar(
    @UsuarioAtual() usuarioId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: AtualizarTarefaDto,
  ) {
    return this.tarefas.atualizar(usuarioId, id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir tarefa (HU-09)' })
  @ApiResponse({ status: 204, description: 'Excluída' })
  @ApiResponse({
    status: 401,
    description: 'Sem token ou token inválido',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não existe ou pertence a outro usuário',
    type: RespostaErroDto,
  })
  excluir(
    @UsuarioAtual() usuarioId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.tarefas.excluir(usuarioId, id)
  }
}
