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
import dayjs from 'dayjs';
import Sequelize from 'sequelize';
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

    @Column({
        field: 'order_id',
    })
    orderId: string;

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

    @Column({
        field: 'name_list',
    })
    nameList: string;

    @Column
    code: string;

    @Column
    category: string;

    @Column
    spec: string;

    @Column
    discount: string;

    @Column
    number: number;

    @Column
    remark: string;

    @Column
    status: OrderStatus;

    @CreatedAt
    @Column({
        field: 'created_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
    createdAt: string;

    @Column({
        field: 'update_time',
    })
    updateTime: string;

    @Column({
        field: 'create_time',
    })
    createTime: string;

    @UpdatedAt
    @Column({
        field: 'updated_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
    updatedAt: string;

    @DeletedAt
    @Column({
        field: 'deleted_at',
        get(): any {
            return this.getDataValue('deletedAt' as any);
        },
        set(value: any) {
            const time = dayjs(value).format('YYYY-MM-DD HH:mm');
            this.setDataValue('deleted_at' as any, time);
        },
    })
    deletedAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Customer)
    customer: Customer;
}
