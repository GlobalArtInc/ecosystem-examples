import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { InjectTemporalClient } from "@globalart/nestjs-temporal";
import { WorkflowClient } from "@temporalio/client";
import { randomUUID } from "crypto";

@Controller()
export class AppController {
  constructor(
    @InjectTemporalClient()
    private readonly temporal: WorkflowClient
  ) {}

  @Get("hello")
  async hello() {
    const workflowId = randomUUID();
    await this.temporal.start("helloWorld", {
      workflowId,
      taskQueue: "default",
      args: [{ workflowId }],
    });

    return {
      workflowId,
    };
  }
}
