import { ApiProperty } from '@nestjs/swagger';
import { timeStamp } from 'console';
import { Order } from '../order.entity';
import { OrderStatus } from '../../shared/enum';
import dayjs from 'dayjs';
export class OrderDto {
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly orderId: string;

    @ApiProperty()
    readonly userId: string;

    @ApiProperty()
    readonly customerId: string;

    @ApiProperty()
    readonly productId: string;

    // @ApiProperty()
    // readonly name: string;

    @ApiProperty()
    readonly nameList: string;

    // @ApiProperty()
    // readonly code: string;

    // @ApiProperty()
    // readonly category: string;

    // @ApiProperty()
    // readonly spec: string;

    @ApiProperty()
    readonly discount: string;

    @ApiProperty()
    readonly number: number;

    @ApiProperty()
    readonly status: OrderStatus;

    @ApiProperty()
    readonly remark: string;

    @ApiProperty()
    readonly createdAt: string;

    @ApiProperty()
    readonly updatedAt: string;

    @ApiProperty()
    readonly createTime: string;

    @ApiProperty()
    readonly updateTime: string;

    @ApiProperty()
    readonly salesmanName: string;

    @ApiProperty()
    readonly customer: any;

    @ApiProperty()
    readonly salesman: any;

    @ApiProperty()
    readonly product: any;

    @ApiProperty()
    readonly customerName: string;

    constructor(order: Order) {
        this.id = order.id;
        this.orderId = order.orderId;
        this.userId = order.userId;
        this.customerId = order.customerId;
        this.productId = order.productId;
        this.nameList = order.nameList;
        // this.spec = order.spec;
        // this.category = order.category;
        this.remark = order.remark;
        this.number = order.number;
        this.discount = order.discount;
        this.status = order.status;
        this.salesmanName = order.user.username;
        this.customerName = order.customer.username;
        this.customer = order.customer;
        this.salesman = order.user;

        // this.authorFirstName = order.user.firstName;
        // this.authorLastName = order.user.lastName;
        this.updateTime = order.updateTime;
        this.createTime = order.createTime;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
    }
}
