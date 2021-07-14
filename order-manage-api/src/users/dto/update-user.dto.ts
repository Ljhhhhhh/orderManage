import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    Min,
    Max,
    isNumber,
    IsString,
    MinLength,
    IsOptional,
} from 'class-validator';

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    status: 0 | 1;
}
