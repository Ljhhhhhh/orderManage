import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
    @ApiProperty()
    @IsString()
    readonly username: string;

    @ApiProperty()
    @IsString()
    readonly address: string;

    @ApiProperty()
    @IsString()
    readonly linkName: string;

    @ApiProperty()
    @IsString()
    @IsPhoneNumber('CH')
    readonly phone: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly remark: string;
}
