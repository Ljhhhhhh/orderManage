import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { customerProviders } from './customer.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [CustomerController],
    providers: [CustomerService, ...customerProviders],
    exports: [],
})
export class CustomerModule {}
