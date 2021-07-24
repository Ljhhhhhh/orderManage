import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './product/product.module';

@Module({
    imports: [
        UsersModule,
        CustomerModule,
        OrderModule,
        ProductsModule,
        SharedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
