import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { setupApp } from './config/app'
import { setupSwagger } from './config/swagger'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupApp(app)

  setupSwagger(app)

  const env = app.get(EnvService)

  await app.listen(env.get('PORT'))
}

void bootstrap()
