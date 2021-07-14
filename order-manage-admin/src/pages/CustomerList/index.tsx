import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { fetchCustomer } from '@/services/ant-design-pro/api';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.TCustomer>[] = [
    {
      title: '客户姓名',
      dataIndex: 'username',
    },
    {
      title: '联系人',
      dataIndex: 'linkName',
    },
    {
      title: '客户编号',
      dataIndex: 'code',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '所属销售',
      dataIndex: 'salesmanName',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.TCustomer, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          searchText: '查询',
          resetText: '重置',
          collapseRender: () => <></>,
        }}
        options={false}
        toolBarRender={() => []}
        request={fetchCustomer}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
