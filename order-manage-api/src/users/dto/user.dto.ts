import { User } from './../user.entity';
import { Gender, RoleType } from '../../shared/enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    readonly username: string;

    @ApiProperty()
    readonly phone: string;

    @ApiProperty()
    readonly role: RoleType;

    @ApiProperty()
    readonly status: 0 | 1;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.phone = user.phone;
        this.role = user.role;
        this.status = user.status;
    }
}
