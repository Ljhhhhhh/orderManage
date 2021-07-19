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

export type OrderStatus = -1 | 0 | 1 | 2 | 3;
// 已取消 - 待确认 - 生成中 - 待发货 - 已发货
// {
//     'wait_confirm' = 'wait_confirm',
//     'productive' = 'productive',
//     'wait_ship' = 'wait_ship',
//     'ship' = 'ship',
// }

export interface productInOrderProps {
    id?: string;
    orderId: string;
    name: string;
    code: string;
    number: number;
    spec: string;
    discount: string;
    category: string;
    remark?: string;
    status: OrderStatus;
    customerId: string;
}
