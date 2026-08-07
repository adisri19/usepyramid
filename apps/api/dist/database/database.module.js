"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongod = null;
async function getMongoUri(configService) {
    const uri = configService.get('MONGODB_URI');
    if (uri) {
        console.log('Connecting to configured MONGODB_URI:', uri);
        return uri;
    }
    console.log('No MONGODB_URI found. Starting mongodb-memory-server...');
    try {
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        console.log('In-memory MongoDB started successfully at:', memoryUri);
        return memoryUri;
    }
    catch (error) {
        console.error('Failed to start in-memory MongoDB server:', error);
        throw error;
    }
}
let DatabaseModule = class DatabaseModule {
    async onApplicationShutdown() {
        if (mongod) {
            console.log('Stopping in-memory MongoDB server...');
            await mongod.stop();
            console.log('In-memory MongoDB server stopped.');
        }
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const uri = await getMongoUri(configService);
                    return {
                        uri,
                    };
                },
            }),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map