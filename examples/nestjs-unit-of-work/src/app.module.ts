
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnitOfWorkModule } from '@globalart/nestjs-unit-of-work';
import { AppController } from './app.controller';
import { TypeormOutboxEntity } from "@globalart/nestjs-typeorm-outbox";
import { TestEntity } from "./test.entity";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'temporal-postgres.temporal-dev',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      synchronize: true,
      logging: true,
      entities: [TestEntity],
    }),
    TypeOrmModule.forFeature([TestEntity]),
    UnitOfWorkModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
