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
import { Customer } from '../customer/customer.entity';
import { OrderStatus } from '../shared/enum';

@Table({
    tableName: 'order',
})
export class Order extends Model<Order> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: 'user_id',
    })
    userId: string;

    @ForeignKey(() => Customer)
    @Column({
        type: DataType.UUID,
        field: 'customer_id',
    })
    customerId: string;

    @Column
    name: string;

    @Column
    spec: string;

    @Column
    discount: string;

    @Column
    status: OrderStatus;

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
    user: User;

    @BelongsTo(() => Customer)
    customer: Customer;
}
