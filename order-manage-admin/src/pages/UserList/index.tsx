import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Popconfirm, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { fetchUser, createUser, updateUser } from '@/services/ant-design-pro/api';
import { CurrentUser, RoleType } from '@/models/user';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CurrentUser) => {
  const hide = message.loading('正在添加');
  try {
    await createUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试!');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CurrentUser>();

  const columns: ProColumns<API.CurrentUser>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        [RoleType.ADMIN]: {
          text: '管理员',
          value: 0,
        },
        [RoleType.SALESMAN]: {
          text: '销售人员',
          value: 1,
        },
        [RoleType.PRODUCTION]: {
          text: '生产人员',
          value: 2,
        },
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status, row) => {
        return (
          <Tag color={status === 1 ? '#87d068' : '#f50'}>{status === 1 ? '启用' : '停用'}</Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, row) => {
        if (row.role === RoleType.ADMIN) {
          return <span>-</span>;
        }
        return (
          <Popconfirm
            cancelText="取消"
            okText="确认"
            title={row.status === 1 ? '确认停用' : '确认启用'}
            onConfirm={() => toggleStatus(row)}
          >
            <Button size="small" danger={row.status === 1 ? true : false} type="primary">
              {row.status === 1 ? '停用' : '启用'}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const toggleStatus = async (record: CurrentUser) => {
    const result: any = await updateUser(record.id, { status: record.status === 1 ? 0 : 1 });
    if (result.code === 0) {
      message.success('操作成功');
      actionRef.current?.reload();
    }
    console.log(result);
  };

  return (
    <PageContainer>
      <ProTable<API.CurrentUser, API.PageParams>
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
        request={fetchUser}
        columns={columns}
      />
      <ModalForm
        title="新增用户"
        layout="horizontal"
        width="480px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          value.phone = '+86' + value.phone;
          const success = await handleAdd(value as API.CurrentUser);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '用户名必填',
            },
          ]}
          width="md"
          name="username"
          placeholder="请输入用户名"
          label="用户名"
        />
        <ProFormText
          width="md"
          name="password"
          label="密码"
          placeholder="请输入密码"
          rules={[
            {
              required: true,
              message: '密码必填',
            },
          ]}
        />
        <ProFormSelect
          name="role"
          label="角色"
          valueEnum={{
            ADMIN: '管理员',
            SALESMAN: '销售人员',
            PRODUCTION: '生产人员',
          }}
          placeholder="请选择角色"
          rules={[{ required: true, message: '角色必选' }]}
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
      </ModalForm>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.username && (
          <ProDescriptions<API.CurrentUser>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.username,
            }}
            columns={columns as ProDescriptionsItemProps<API.CurrentUser>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
