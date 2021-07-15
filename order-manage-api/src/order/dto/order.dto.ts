import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../order.entity';

export class OrderDto {
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly userId: string;

    @ApiProperty()
    readonly customerId: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly category: string;

    @ApiProperty()
    readonly spec: string;

    @ApiProperty()
    readonly discount: string;

    @ApiProperty()
    readonly status: string;

    @ApiProperty()
    readonly remark: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    constructor(order: Order) {
        this.id = order.id;
        this.userId = order.userId;
        this.customerId = order.customerId;
        this.name = order.name;
        this.discount = order.discount;
        this.spec = order.spec;

        // this.authorFirstName = order.user.firstName;
        // this.authorLastName = order.user.lastName;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
    }
}
