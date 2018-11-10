import { NestFactory } from '@nestjs/core';
import * as mosca from 'mosca';
import { AppModule } from './app.module';
import { SensorsSchema } from './sensors/sensors.schema';

const mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@localhost:27017');
const Sensors = mongoose.model('Sensors', SensorsSchema);

const server = new mosca.Server({
  port: 1883,
  backend: {
    type: 'mongo',
    url: 'mongodb://root:root@localhost:27017',
    pubsubCollection: 'ascoltatori',
  },
});

server.on('clientConnected', client => {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', (packet, client) => {
  const raw = packet.payload.toString('utf-8');
  try {
    const data = JSON.parse(raw);
    const sensors = new Sensors(data);
    sensors.save();
  } catch (e) {
    console.error(e);
  }

  console.log('Published', raw);
});

server.on('ready', () => {
  console.log('Mosca server is up and running');
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
