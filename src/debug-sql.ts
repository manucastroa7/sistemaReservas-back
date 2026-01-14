import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
    const dataSource = app.get(DataSource);

    try {
        console.log('--- DB Check ---');
        const resCount = await dataSource.query(`SELECT COUNT(*) FROM reservations`);
        console.log('Total Reservations:', resCount[0]);

        const junctionCount = await dataSource.query(`SELECT COUNT(*) FROM reservation_rooms`);
        console.log('Junction Table (reservation_rooms) Count:', junctionCount[0]);

        if (parseInt(junctionCount[0].count) === 0) {
            console.log('CRITICAL: reservation_rooms table is empty!');
        } else {
            // Check sample
            const sample = await dataSource.query(`SELECT * FROM reservation_rooms LIMIT 5`);
            console.log('Sample junction rows:', sample);
        }

    } catch (e) {
        console.error('Error:', e);
    }

    await app.close();
}
bootstrap();
