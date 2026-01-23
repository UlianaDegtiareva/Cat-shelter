"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Приют для кошек')
        .setDescription('Система управления кошками и пользователями (без регистрации)')
        .setVersion('1.0')
        .addTag('cats', 'Операции с животными')
        .addTag('users', 'Операции с пользователями')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
    console.log(`Приложение запущено на: http://localhost:3000/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map