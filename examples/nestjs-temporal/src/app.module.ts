import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TemporalModule } from "@globalart/nestjs-temporal";
import * as path from "path";
import {
  bundleWorkflowCode,
  NativeConnection,
  Runtime,
} from "@temporalio/worker";
import { Connection } from "@temporalio/client";
import { HelloWorldActivity } from "./activities";

@Module({
  imports: [
    TemporalModule.registerWorkerAsync({
      useFactory: async () => {
        Runtime.install({
          shutdownSignals: ["SIGINT", "SIGTERM"],
          workerHeartbeatInterval: "30 seconds",
        });
        const connection = await NativeConnection.connect({
          address: "127.0.0.1:7233",
        });
        const workflowBundle = await bundleWorkflowCode({
          workflowsPath: path.join(__dirname, "./workflows"),
        });

        return {
          workerOptions: {
            connection,
            taskQueue: "default",
            workflowBundle,
          },
        };
      },
    }),
    TemporalModule.registerClientAsync({
      useFactory: async () => {
        const connection = await Connection.connect({
          address: "127.0.0.1:7233",
        });

        return {
          connection,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [HelloWorldActivity],
})
export class AppModule {}
