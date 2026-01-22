import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs } from "@nestjs/config";

const kafkaConfig = registerAs('kafka', (): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'kafka-client',
      brokers: ['kafka-dev-kafka-0.kafka-dev-kafka-brokers.kafka-broker.svc:9092'],
    },
  },
}));

export const configs = [kafkaConfig];