import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Tag } from 'antd';
import { fetchOrder, orderDetail } from '@/services/ant-design-pro/api';
import { history } from 'umi';

const OrderList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.TCustomer>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              history.push(`/order/${dom}`);
              // setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '产品名称',
      dataIndex: 'nameList',
      render: (nameList: any) => {
        const nameArr = nameList.split('!@!@');
        return nameArr.join('/');
      },
    },
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      valueType: 'textarea',
    },
    {
      title: '销售人员',
      dataIndex: 'salesmanName',
    },

    {
      title: '订单状态',
      dataIndex: 'status',
      render: (dom: any) => {
        const status = dom.props.text;
        let color, msg;
        switch (status) {
          case 0:
            color = '#f50';
            msg = '未确认';
            break;
          case 1:
            color = '#40a9ff';
            msg = '生产中';
            break;
          case 2:
            color = '#52c41a';
            msg = '待发货';
            break;
          case 3:
            color = '#faad14';
            msg = '已发货';
            break;

          default:
            break;
        }
        return <Tag color={color}>{msg}</Tag>;
      },
      valueType: 'select',
      valueEnum: {
        0: {
          text: '待确认',
          value: 0,
        },
        1: {
          text: '生产中',
          value: 1,
        },
        2: {
          text: '待发货',
          value: 2,
        },
        3: {
          text: '已发货',
          value: 3,
        },
      },
    },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   hideInForm: true,
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.TCustomer, API.PageParams>
        actionRef={actionRef}
        rowKey="orderId"
        search={{
          labelWidth: 120,
        }}
        options={false}
        // toolBarRender={() => []}
        request={fetchOrder}
        columns={columns}
      />
    </PageContainer>
  );
};

export default OrderList;
