import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProviders } from './order.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [OrderController],
    providers: [OrderService, ...OrderProviders],
    exports: [],
})
export class OrderModule {}
