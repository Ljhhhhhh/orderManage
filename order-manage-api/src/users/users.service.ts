import {
    Injectable,
    Inject,
    HttpException,
    HttpStatus,
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from './user.entity';
import { genSalt, hash, compare } from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { JwtPayload } from './auth/jwt-payload.model';
import { sign } from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from './../shared/config/config.service';
import { RoleType } from '../shared/enum';
import { Op } from 'sequelize';

const ROLES_KEY = 'roles';
@Injectable()
export class UsersService {
    private readonly jwtPrivateKey: string;

    constructor(
        @Inject('UsersRepository')
        private readonly usersRepository: typeof User,
        private readonly configService: ConfigService,
    ) {
        this.jwtPrivateKey = this.configService.jwtConfig.privateKey;
    }
    async findAll(query: {
        pageSize: number;
        current: number;
        username?: string;
        role?: RoleType;
    }) {
        const { pageSize = 10, current = 1, username, role } = query;
        const where: any = {};
        if (username) {
            where.username = {
                [Op.like]: `%${username}%`,
            };
        }

        role && (where.role = role);
        const users = await this.usersRepository.findAll<User>({
            where,
            limit: pageSize,
            offset: current === 1 ? 0 : (current - 1) * pageSize,
        });

        const list = users.map(user => new UserDto(user));
        return {
            list,
            total: await this.usersRepository.count({
                where,
            }),
            current,
        };
    }

    async getUser(id: string) {
        const user = await this.usersRepository.findByPk<User>(id);
        if (!user) {
            throw new HttpException(
                'User with given id not found',
                HttpStatus.NOT_FOUND,
            );
        }
        return new UserDto(user);
    }

    async getUserByUsername(username: string, active: boolean = true) {
        const where: any = { username };
        if (active) {
            where.status = {
                [Op.eq]: 1,
            };
        }
        return await this.usersRepository.findOne<User>({
            where,
        });
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const user = new User();
            user.username = createUserDto.username.trim().toLowerCase();
            user.role = createUserDto.role;
            user.phone = createUserDto.phone;
            user.status = 1;
            const salt = await genSalt(10);
            user.password = await hash(createUserDto.password, salt);

            const userData = await user.save();

            // when registering then log user in automatically by returning a token
            const token = await this.signToken(userData);
            return new UserLoginResponseDto(userData, token);
        } catch (err) {
            if (err.original.constraint === 'user_email_key') {
                throw new HttpException(
                    `User with email '${err.errors[0].value}' already exists`,
                    HttpStatus.CONFLICT,
                );
            }

            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(userLoginRequestDto: UserLoginRequestDto) {
        const username = userLoginRequestDto.username;
        const password = userLoginRequestDto.password;

        const user = await this.getUserByUsername(username);
        if (!user) {
            throw new HttpException(
                'Invalid email or password.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            throw new HttpException(
                'Invalid email or password.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const token = await this.signToken(user);
        return new UserLoginResponseDto(user, token);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        console.log(updateUserDto, 'updateUserDto');
        const user = await this.usersRepository.findByPk<User>(id);
        if (!user) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        if (updateUserDto.password) {
            const salt = await genSalt(10);
            user.password = await hash(updateUserDto.password, salt);
        }

        if (updateUserDto.status !== undefined) {
            user.status = updateUserDto.status;
        }

        try {
            const data = await user.save();
            return new UserDto(data);
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateFromAdmin(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findByPk<User>(id);
        if (!user) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        if (updateUserDto.password) {
            const salt = await genSalt(10);
            user.password = await hash(updateUserDto.password, salt);
        }

        if (updateUserDto.status !== undefined) {
            user.status = updateUserDto.status;
        }

        try {
            const data = await user.save();
            return new UserDto(data);
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string) {
        const user = await this.usersRepository.findByPk<User>(id);
        await user.destroy();
        return new UserDto(user);
    }

    async signToken(user: User) {
        const payload: JwtPayload = {
            username: user.username,
        };

        return sign(payload, this.jwtPrivateKey, {});
    }
}
