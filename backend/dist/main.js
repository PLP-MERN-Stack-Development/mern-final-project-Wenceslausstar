"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const jwtSecretPresent = Boolean(process.env.JWT_SECRET);
    const configuredPort = process.env.PORT ?? '3001';
    console.log('Startup check: JWT_SECRET set?', jwtSecretPresent);
    console.log('Startup check: PORT =', configuredPort);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    try {
        await app.listen(process.env.PORT ?? 3001);
    }
    catch (err) {
        if (err?.code === 'EADDRINUSE') {
            console.error(`Port ${process.env.PORT ?? 3001} is already in use. Stop other instances or change PORT in ".env".`);
        }
        throw err;
    }
}
bootstrap();
//# sourceMappingURL=main.js.map