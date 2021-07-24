import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { productsProviders } from './product.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [ProductsController],
    providers: [ProductsService, ...productsProviders],
    exports: [],
})
export class ProductsModule {}
