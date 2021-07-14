import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString } from 'class-validator';
import shortid from 'shortid';

export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    readonly customerId: string;

    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly spec: string;

    @ApiProperty()
    @IsString()
    readonly discount: string;
}
