import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsPhoneNumber,
    IsEnum,
    IsOptional,
    MinLength,
    IsInt,
} from 'class-validator';
import { RoleType } from '../../shared/enum';

export class UpdateUserDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly username: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @ApiProperty()
    @IsPhoneNumber('CH')
    readonly phone: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(RoleType)
    readonly role: RoleType;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    status: 0 | 1;
}
