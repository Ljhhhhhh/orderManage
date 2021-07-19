import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsArray } from 'class-validator';
import { productInOrderProps } from '../../shared/enum';
import shortid from 'shortid';

export class CreateOrderDto {
    // @ApiProperty()
    // @IsString()
    // readonly userId: string;

    @ApiProperty()
    @IsString()
    readonly customerId: string;

    @ApiProperty()
    @IsArray()
    readonly productList: productInOrderProps[];
    // TODO： 修改产品成列表 数据库同步修改 一个产品一条数据，同用一个订单id，订单列表通过id分组查询

    // @ApiProperty()
    // @IsString()
    // readonly name: string;

    // @ApiProperty()
    // @IsString()
    // readonly code: string;

    // @ApiProperty()
    // @IsString()
    // readonly spec: string;

    // @ApiProperty()
    // @IsString()
    // readonly discount: string;

    // @ApiProperty()
    // @IsString()
    // readonly category: string;
}
