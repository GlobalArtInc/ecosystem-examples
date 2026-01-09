import { Activity, InjectTemporalClient } from "@globalart/nestjs-temporal";
import { Injectable } from "@nestjs/common";
import { WorkflowClient } from "@temporalio/client";
import { Activities } from "@globalart/nestjs-temporal";
import { IHelloWorldWorkflow } from "src/workflows";

@Injectable()
@Activities({ name: "hello-world-activities" })
export class HelloWorldActivity {
  @Activity({ name: "prepare-hello-world" })
  async prepareHelloWorld(data: IHelloWorldWorkflow) {
    return `Preparing Hello, World! ${data.workflowId}`;
  }

  @Activity({ name: "execute-hello-world" })
  async executeHelloWorld(data: IHelloWorldWorkflow) {
    return `Executing Hello, World! ${data.workflowId}`;
  }
}

export interface IHelloWorldActivity {
  prepareHelloWorld: (data: IHelloWorldWorkflow) => Promise<string>;
  executeHelloWorld: (data: IHelloWorldWorkflow) => Promise<string>;
}
