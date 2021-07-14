import {
    IsString,
    IsPhoneNumber,
    IsEnum,
    IsOptional,
    MinLength,
} from 'class-validator';
import { RoleType } from '../../shared/enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    readonly username: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @ApiProperty()
    @IsPhoneNumber('CH')
    readonly phone: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(RoleType)
    readonly role: RoleType;
}
