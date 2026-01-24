import { TypeormOutboxEntity } from '@globalart/nestjs-typeorm-outbox';
import { TypeormOutboxModule } from "@globalart/nestjs-typeorm-outbox";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configs } from './config';
import { CronExpression } from '@globalart/nestjs-typeorm-outbox';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configs],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'temporal-postgres.temporal-dev',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      synchronize: true,
      entities: [TypeormOutboxEntity],
    }),
    TypeormOutboxModule.forRoot({
      typeOrmConnectionName: 'default',
    }),
    // TypeormOutboxModule.registerCronAsync({
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       kafkaConfig: configService.get('kafka'),
    //       typeOrmConnectionName: 'default',
    //       cronExpression: CronExpression.EVERY_1_SECOND,
    //     }
    //   },
    //   inject: [ConfigService],
    // })
  ],
  // controllers: [AppController],
})
export class AppModule {}
