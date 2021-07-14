import { Customer } from './customer.entity';

export const customerProviders = [
    { provide: 'CustomerRepository', useValue: Customer },
];
