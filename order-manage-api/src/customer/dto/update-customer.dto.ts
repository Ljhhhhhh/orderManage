import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    readonly username: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    readonly address: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    readonly linkName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    readonly phone: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    readonly remark: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    readonly salesmanId: string;
}
