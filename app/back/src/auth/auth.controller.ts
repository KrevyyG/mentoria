import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RespostaErroDto } from '../common/swagger/respostas-erro'
import { AuthService } from './auth.service'
import { RegistroDto } from './dto/registro.dto'
import { LoginDto } from './dto/login.dto'
import { RespostaLoginDto, UsuarioDto } from './dto/respostas.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('registro')
  @ApiOperation({ summary: 'Criar conta (HU-01)' })
  @ApiResponse({ status: 201, description: 'Conta criada', type: UsuarioDto })
  @ApiResponse({
    status: 400,
    description: 'E-mail inválido ou senha em branco',
    type: RespostaErroDto,
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail já cadastrado',
    type: RespostaErroDto,
  })
  registrar(@Body() dto: RegistroDto) {
    return this.auth.registrar(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Entrar e receber o token (HU-02)' })
  @ApiResponse({ status: 200, description: 'Autenticado', type: RespostaLoginDto })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    type: RespostaErroDto,
  })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Encerrar a sessão (HU-02)',
    description:
      'Back é stateless; o front descarta o token. Endpoint existe por simetria do contrato.',
  })
  @ApiResponse({ status: 204, description: 'Sessão encerrada' })
  logout() {
    return
  }
}
