import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString } from 'class-validator';

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

    @ApiProperty()
    @IsString()
    readonly category: string;
}
