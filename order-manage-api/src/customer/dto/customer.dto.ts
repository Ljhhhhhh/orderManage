import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../customer.entity';
import { User } from '../../users/user.entity';

export class CustomerDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    readonly username: string;

    @ApiProperty()
    readonly code: string;

    @ApiProperty()
    readonly address: string;

    @ApiProperty()
    readonly linkName: string;

    @ApiProperty()
    readonly phone: string;

    @ApiProperty()
    readonly salesmanId: string;

    @ApiProperty()
    readonly salesmanName: string;

    @ApiProperty()
    readonly remark: string;

    constructor(customer: Customer) {
        this.id = customer.id;
        this.username = customer.username;
        this.code = customer.code;
        this.address = customer.address;
        this.linkName = customer.linkName;
        this.phone = customer.phone;
        this.salesmanId = customer.salesmanId;
        this.remark = customer.remark;
        this.salesmanName = customer.salesman.username;
    }
}
