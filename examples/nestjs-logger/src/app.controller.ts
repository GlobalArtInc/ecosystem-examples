import { BadRequestException, Controller, Get, Inject } from "@nestjs/common";
import { ExcludeLogging, InjectLogger } from "@globalart/nestjs-logger";
import { LoggerService } from "@globalart/nestjs-logger";
import axios from "axios";

@Controller()
export class AppController {
  constructor(
    @InjectLogger(AppController.name)
    private readonly logger: LoggerService,
  ) {}

  @Get("info")
  async loggerInfo(): Promise<string> {
    this.logger.log({
      message: "Hello World!",
    });

    return "Hello World!";
  }

  @Get("error")
  loggerError(): string {
    throw new BadRequestException("Error!");
  }

  @ExcludeLogging()
  @Get("hello/exclude-logging")
  getHelloExcludeLogging(): string {
    return "Hello World!";
  }
}
