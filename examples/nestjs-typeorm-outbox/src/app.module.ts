import { TypeormOutboxEntity } from '@globalart/nestjs-typeorm-outbox';
import { TypeormOutboxModule } from "@globalart/nestjs-typeorm-outbox";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configs } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      synchronize: true,
      entities: [TypeormOutboxEntity],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configs],
    }),
    TypeormOutboxModule.forRoot({
      typeOrmConnectionName: 'default',
    }),
    TypeormOutboxModule.registerCronAsync({
      useFactory: (configService: ConfigService) => {
        return {
          kafkaConfig: configService.get('kafka'),
          typeOrmConnectionName: 'default',
        }
      },
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
})
export class AppModule {}
