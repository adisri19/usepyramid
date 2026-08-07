import { Module, Global, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

async function getMongoUri(configService: ConfigService): Promise<string> {
  const uri = configService.get<string>('MONGODB_URI');
  if (uri) {
    console.log('Connecting to configured MONGODB_URI:', uri);
    return uri;
  }

  console.log('No MONGODB_URI found. Starting mongodb-memory-server...');
  try {
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    console.log('In-memory MongoDB started successfully at:', memoryUri);
    return memoryUri;
  } catch (error) {
    console.error('Failed to start in-memory MongoDB server:', error);
    throw error;
  }
}

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = await getMongoUri(configService);
        return {
          uri,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    if (mongod) {
      console.log('Stopping in-memory MongoDB server...');
      await mongod.stop();
      console.log('In-memory MongoDB server stopped.');
    }
  }
}
