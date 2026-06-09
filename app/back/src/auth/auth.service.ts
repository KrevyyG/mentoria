import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { RegistroDto } from './dto/registro.dto'
import { LoginDto } from './dto/login.dto'

const MENSAGEM_CREDENCIAIS_INVALIDAS = 'Credenciais inválidas'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async registrar(dto: RegistroDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      select: { id: true },
    })
    if (existe) {
      throw new ConflictException('E-mail já cadastrado')
    }

    const senhaHash = await argon2.hash(dto.senha)
    const usuario = await this.prisma.usuario.create({
      data: { email: dto.email, senhaHash },
      select: { id: true, email: true },
    })
    return usuario
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    })
    if (!usuario) {
      throw new UnauthorizedException(MENSAGEM_CREDENCIAIS_INVALIDAS)
    }

    const senhaOk = await argon2.verify(usuario.senhaHash, dto.senha)
    if (!senhaOk) {
      throw new UnauthorizedException(MENSAGEM_CREDENCIAIS_INVALIDAS)
    }

    const token = await this.jwt.signAsync({ sub: usuario.id })
    return {
      token,
      usuario: { id: usuario.id, email: usuario.email },
    }
  }
}
