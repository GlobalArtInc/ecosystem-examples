import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnitOfWorkModule } from "@globalart/nestjs-unit-of-work";
import { AppController } from "./app.controller";
import { TestEntity } from "./test.entity";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgresql.postgresql-ru-default.svc.cluster.local",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "postgres",
      synchronize: true,
      logging: true,
      entities: [TestEntity],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([TestEntity]),
    UnitOfWorkModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
