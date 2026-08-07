import { OnApplicationShutdown } from '@nestjs/common';
export declare class DatabaseModule implements OnApplicationShutdown {
    onApplicationShutdown(): Promise<void>;
}
