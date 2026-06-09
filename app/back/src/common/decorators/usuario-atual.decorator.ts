import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UsuarioAtual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ user?: { id: string } }>()
    if (!req.user?.id) {
      throw new Error('UsuarioAtual usado sem JwtAuthGuard')
    }
    return req.user.id
  },
)
