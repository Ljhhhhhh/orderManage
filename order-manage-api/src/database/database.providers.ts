import { Product } from './../product/product.entity';
import { Sequelize } from 'sequelize-typescript';
import { User } from './../users/user.entity';
import { Customer } from '../customer/customer.entity';
import { Order } from '../order/order.entity';
import { ConfigService } from './../shared/config/config.service';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize(configService.sequelizeOrmConfig);
            sequelize.addModels([User, Customer, Order, Product]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];
