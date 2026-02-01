import { TypeormOutboxService } from "@globalart/nestjs-typeorm-outbox";
import { InjectTypeormOutboxService, } from "@globalart/nestjs-typeorm-outbox";
import { IsolationLevel, UnitOfWorkManager } from "@globalart/nestjs-unit-of-work";
import { UOW } from "@globalart/nestjs-unit-of-work";
import { Controller, Get, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TestEntity } from "./test.entity";
import { Repository } from "typeorm";

@Controller()
export class AppController {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
    private readonly unitOfWorkManager: UnitOfWorkManager,
  ) {}

  @Get('decorator')
  @UOW({ isolationLevel: IsolationLevel.SERIALIZABLE })
  async decorator() {
    const test = this.testRepository.create({
      name: 'Test',
    });
    await this.testRepository.save(test);
    throw new Error('Test error');
    return test;
  }

  @Get('manager')
  async manager() {
    return this.unitOfWorkManager.runInTransaction(async (uow) => {
      const test = this.testRepository.create({
        name: 'Test',
      });
      await this.testRepository.save(test);
      throw new Error('Test error');
      return test;
    }, IsolationLevel.SERIALIZABLE);
  }

  @Get('without-uow')
  async withoutUow() {
    const test = this.testRepository.create({
      name: 'Test',
    });
    await this.testRepository.save(test);
    throw new Error('Test error');
    return test;
  }
}
