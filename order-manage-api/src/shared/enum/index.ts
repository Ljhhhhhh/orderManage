export enum Gender {
    female = 'female',
    male = 'male',
}

export enum RoleType {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SALESMAN = 'SALESMAN',
    PRODUCTION = 'PRODUCTION',
}

export type OrderStatus = 0 | 1 | 2 | 3;
// 待确认 - 生成中 - 待发货 - 已发货
// {
//     'wait_confirm' = 'wait_confirm',
//     'productive' = 'productive',
//     'wait_ship' = 'wait_ship',
//     'ship' = 'ship',
// }
