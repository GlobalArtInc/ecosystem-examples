import { proxyActivities } from "@temporalio/workflow";
import { IHelloWorldActivity } from "src/activities";

const { prepareHelloWorld, executeHelloWorld } =
  proxyActivities<IHelloWorldActivity>({
    startToCloseTimeout: "1 minute",
  });

export interface IHelloWorldWorkflow {
  workflowId: string;
}

export const helloWorld = async (data: IHelloWorldWorkflow) => {
  await prepareHelloWorld(data);
  await executeHelloWorld(data);

  return `Hello, World! ${data.workflowId}`;
};
