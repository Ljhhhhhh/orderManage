import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';

@Module({
    imports: [UsersModule, CustomerModule, OrderModule, SharedModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
