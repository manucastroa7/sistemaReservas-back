import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HotelsService } from './hotels/hotels.service';
import * as fs from 'fs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
    const hotelsService = app.get(HotelsService);

    console.log('--- Debug Stats ---');
    try {
        const stats = await hotelsService.getDebugStats();
        fs.writeFileSync('debug-output.json', JSON.stringify(stats, null, 2));
        console.log('Stats written to debug-output.json');
    } catch (e) {
        console.error('Error fetching stats:', e);
    }

    await app.close();
}
bootstrap();
