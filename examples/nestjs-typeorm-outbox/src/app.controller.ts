import { TypeormOutboxService } from "@globalart/nestjs-typeorm-outbox";
import { InjectTypeormOutboxService, } from "@globalart/nestjs-typeorm-outbox";
import { Controller, Get, Post } from "@nestjs/common";

@Controller()
export class AppController {
  constructor(
    @InjectTypeormOutboxService()
    private readonly typeormOutboxService: TypeormOutboxService) {}

  @Get('')
  async sendMessage() {
    return this.typeormOutboxService.create({
      destinationTopic: 'test',
      payload: {
        message: 'Hello, world!',
      },
    })
  }
}