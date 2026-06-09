import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CategoriasModule } from './categorias/categorias.module'
import { PrismaModule } from './prisma/prisma.module'
import { TarefasModule } from './tarefas/tarefas.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TarefasModule,
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
