import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';
import { OrderStatus } from '../../shared/enum';
import { productInOrderProps } from '../../shared/enum';

export class UpdateOrderDto {
    @ApiProperty()
    @IsArray()
    readonly productList: productInOrderProps[];
    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // @Length(3, 60)
    // readonly name: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly spec: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly customerId: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly category: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly code: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly remark: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly discount: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly status: OrderStatus;
}
