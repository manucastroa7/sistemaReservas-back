"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const hotels_service_1 = require("./hotels/hotels.service");
const fs = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false });
    const hotelsService = app.get(hotels_service_1.HotelsService);
    console.log('--- Debug Stats ---');
    try {
        const stats = await hotelsService.getDebugStats();
        fs.writeFileSync('debug-output.json', JSON.stringify(stats, null, 2));
        console.log('Stats written to debug-output.json');
    }
    catch (e) {
        console.error('Error fetching stats:', e);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=debug-data.js.map