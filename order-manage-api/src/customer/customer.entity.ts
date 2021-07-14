import {
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    DataType,
    Model,
    ForeignKey,
    Unique,
    Length,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table({
    tableName: 'customer',
})
export class Customer extends Model<Customer> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: 'salesman_id',
    })
    salesmanId: string;

    @Column
    code: string;

    @Column
    username: string;

    @Column
    address: string;

    @Column({
        type: DataType.UUID,
        field: 'link_name',
    })
    linkName: string;

    @Column
    phone: string;

    @Column
    remark: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deleted_at' })
    deletedAt: Date;

    @BelongsTo(() => User)
    salesman: User;
}
