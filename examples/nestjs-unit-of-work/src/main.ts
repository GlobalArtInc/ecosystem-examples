import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(4500, "0.0.0.0");
  console.log("Application is running on: http://localhost:4500");
}
bootstrap();
