"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false });
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        console.log('--- DB Check ---');
        const resCount = await dataSource.query(`SELECT COUNT(*) FROM reservations`);
        console.log('Total Reservations:', resCount[0]);
        const junctionCount = await dataSource.query(`SELECT COUNT(*) FROM reservation_rooms`);
        console.log('Junction Table (reservation_rooms) Count:', junctionCount[0]);
        if (parseInt(junctionCount[0].count) === 0) {
            console.log('CRITICAL: reservation_rooms table is empty!');
        }
        else {
            const sample = await dataSource.query(`SELECT * FROM reservation_rooms LIMIT 5`);
            console.log('Sample junction rows:', sample);
        }
    }
    catch (e) {
        console.error('Error:', e);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=debug-sql.js.map