import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import {
  fetchCustomer,
  fetchUser,
  createCustomer,
  updateCustomer,
} from '@/services/ant-design-pro/api';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [salesmanList, setSalesmanList] = useState<any[]>([]);
  const [currentRow, setCurrentRow] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  useEffect(() => {
    getSalesmanList();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      form.resetFields();
      setCurrentRow(undefined);
    }
  }, [createModalVisible]);

  const getSalesmanList = async () => {
    const result = await fetchUser({
      pageSize: 999999,
      role: 'SALESMAN',
    });
    const list = result.data.map((item: any) => {
      return {
        value: item.id,
        label: item.username,
      };
    });
    setSalesmanList(list);
    console.log(list, 'list');
  };

  const columns: ProColumns<API.TCustomer>[] = [
    {
      title: '客户名称',
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
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, row) => {
        return (
          <Button
            onClick={() => {
              const data = {
                ...row,
                phone: row.phone?.substr(3),
              };
              form.setFieldsValue(data);
              setCurrentRow(data);
              handleModalVisible(true);
            }}
          >
            操作
          </Button>
        );
      },
    },
  ];

  const handleAdd = async (values: any) => {
    console.log('handleAdd');
  };

  return (
    <PageContainer>
      <ProTable<API.TCustomer, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          collapseRender: () => <></>,
        }}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={fetchCustomer}
        columns={columns}
      />
      <ModalForm
        title="客户信息"
        layout="horizontal"
        width="480px"
        form={form}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          let result;
          value.phone = '+86' + value.phone;
          if (currentRow && currentRow.id) {
            result = (await updateCustomer(currentRow.id, value as API.CurrentUser)) as any;
          } else {
            result = (await createCustomer(value as API.CurrentUser)) as any;
          }
          if (result.code === 0) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormSelect label="所属销售" name="salesmanId" options={salesmanList} />
        <ProFormText
          rules={[
            {
              required: true,
              message: '客户名称必填',
            },
          ]}
          width="md"
          name="username"
          placeholder="请输入客户名称"
          label="客户名称"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '客户地址必填',
            },
          ]}
          width="md"
          name="address"
          placeholder="请输入客户地址"
          label="客户地址"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '联系人必填',
            },
          ]}
          width="md"
          name="linkName"
          placeholder="请输入联系人"
          label="联系人"
        />
        <ProFormText
          width="md"
          name="phone"
          label="手机号码"
          fieldProps={{
            prefix: '+86',
          }}
          placeholder="请输入手机号码"
          rules={[
            {
              required: true,
              message: '手机号码必填',
            },
          ]}
        />
        <ProFormTextArea width="md" name="remark" label="备注" />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
