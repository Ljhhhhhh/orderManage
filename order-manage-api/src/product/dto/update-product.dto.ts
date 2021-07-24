import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly code: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly spec: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly category: string;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    readonly status: 0 | 1;
}
