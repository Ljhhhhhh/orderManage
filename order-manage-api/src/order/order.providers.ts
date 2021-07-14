import { Order } from './order.entity';

export const OrderProviders = [{ provide: 'OrderRepository', useValue: Order }];
