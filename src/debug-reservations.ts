import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReservationsService } from './reservations/reservations.service';
import { HotelsService } from './hotels/hotels.service';
import * as fs from 'fs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
    const reservationsService = app.get(ReservationsService);
    const hotelsService = app.get(HotelsService);

    const lines = [];
    const log = (msg) => { console.log(msg); lines.push(msg); };

    try {
        const hotels = await hotelsService.findAll();
        const granHotel = hotels.find(h => h.name === 'Gran Hotel Avenida');
        if (!granHotel) { log('Hotel not found'); }
        else {
            const reservations = await reservationsService.findAll(granHotel.id);
            log(`Found ${reservations.length} reservations.`);
            reservations.slice(0, 50).forEach(r => {
                log(`Res ${r.id}: In=${r.checkIn}, Out=${r.checkOut}, Last=${r.lastNight}, RoomIds=${JSON.stringify(r.roomIds)}, RoomID=${r.roomId}`);
            });
        }
        fs.writeFileSync('debug-dates.txt', lines.join('\n'));

    } catch (e) {
        log('Error: ' + e);
        fs.writeFileSync('debug-dates.txt', lines.join('\n'));
    }

    await app.close();
}
bootstrap();
