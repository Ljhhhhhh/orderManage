import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly code: string;

    @ApiProperty()
    @IsString()
    readonly spec: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly category: string;
}
