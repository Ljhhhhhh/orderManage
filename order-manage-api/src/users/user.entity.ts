import {
    Table,
    Column,
    Model,
    Unique,
    IsEmail,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    HasMany,
} from 'sequelize-typescript';
import { RoleType } from '../shared/enum';
import { Customer } from '../customer/customer.entity';

@Table({
    tableName: 'user',
})
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Unique
    @Column
    username: string;

    @Column
    password: string;

    @Column
    phone: string;

    @Column({
        type: DataType.ENUM(
            RoleType.SALESMAN,
            RoleType.ADMIN,
            RoleType.PRODUCTION,
        ),
    })
    role: RoleType;

    @Column
    status: 0 | 1;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deleted_at' })
    deletedAt: Date;

    // @HasMany(() => Customer)
    // posts: Customer[];
}
