import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import importToArray from 'import-to-array';
import * as _models from './domain/models';
import { BlogHttpModule } from './apps/blog/blog.http.module';
const models = importToArray(_models);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'is',
      password: 'love',
      database: 'what',
      entities: models,
      synchronize: true,
    }),
    BlogHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
