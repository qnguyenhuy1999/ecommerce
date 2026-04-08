"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const worker_module_1 = require("./worker.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(worker_module_1.WorkerModule);
    await app.listen(0);
    console.log('[Worker] BullMQ processors running');
}
bootstrap();
//# sourceMappingURL=main.js.map