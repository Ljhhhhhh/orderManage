import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginRequestDto {
    @ApiProperty()
    @IsString()
    readonly username: string;

    @ApiProperty()
    @IsString()
    readonly password: string;
}
