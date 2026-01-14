"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const reservations_service_1 = require("./reservations/reservations.service");
const hotels_service_1 = require("./hotels/hotels.service");
const fs = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false });
    const reservationsService = app.get(reservations_service_1.ReservationsService);
    const hotelsService = app.get(hotels_service_1.HotelsService);
    const lines = [];
    const log = (msg) => { console.log(msg); lines.push(msg); };
    try {
        const hotels = await hotelsService.findAll();
        const granHotel = hotels.find(h => h.name === 'Gran Hotel Avenida');
        if (!granHotel) {
            log('Hotel not found');
        }
        else {
            const reservations = await reservationsService.findAll(granHotel.id);
            log(`Found ${reservations.length} reservations.`);
            reservations.slice(0, 50).forEach(r => {
                log(`Res ${r.id}: In=${r.checkIn}, Out=${r.checkOut}, Last=${r.lastNight}, RoomIds=${JSON.stringify(r.roomIds)}, RoomID=${r.roomId}`);
            });
        }
        fs.writeFileSync('debug-dates.txt', lines.join('\n'));
    }
    catch (e) {
        log('Error: ' + e);
        fs.writeFileSync('debug-dates.txt', lines.join('\n'));
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=debug-reservations.js.map