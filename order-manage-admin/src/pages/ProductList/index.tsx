import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Form, Input, Drawer, Popconfirm, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect, ProFormRadio } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { fetchProduct, createProduct, updateProduct } from '@/services/ant-design-pro/api';
import { CurrentUser, RoleType } from '@/models/user';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CurrentUser) => {
  const hide = message.loading('正在添加');
  try {
    await createProduct({ ...fields });
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
  const [form] = Form.useForm();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();

  useEffect(() => {
    if (!createModalVisible) {
      setCurrentRow(null);
      form.resetFields();
    }
  }, [createModalVisible]);

  const columns: ProColumns<API.CurrentUser>[] = [
    {
      title: '产品名称',
      dataIndex: 'name',
      colSize: 1,
    },
    {
      title: '规格型号',
      dataIndex: 'spec',
      colSize: 1,
    },
    {
      title: '产品编号',
      dataIndex: 'code',
      colSize: 1,
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      hideInSearch: true,
      render: (_: any, row) => {
        return _.status === 1 ? <Tag color="#2db7f5">已上架</Tag> : <Tag color="#f50">已下架</Tag>;
      },
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
              form.setFieldsValue(row);
              handleModalVisible(true);
              const values = {
                ...row,
                status: +row.status,
              };
              setCurrentRow(values);
            }}
          >
            操作
          </Button>
        );
      },
    },
  ];

  // const toggleStatus = async (record: CurrentUser) => {
  //   const result: any = await updateUser(record.id, { status: record.status === 1 ? 0 : 1 });
  //   if (result.code === 0) {
  //     message.success('操作成功');
  //     actionRef.current?.reload();
  //   }
  //   console.log(result);
  // };

  const request = async (params: any) => {
    const { data } = (await fetchProduct(params)) as any;
    return {
      data: data.list,
      success: true,
      total: data.total,
    };
  };

  return (
    <PageContainer>
      <ProTable<API.CurrentUser, API.PageParams>
        actionRef={actionRef}
        pagination={{
          pageSizeOptions: ['1', '2', '5'],
        }}
        rowKey="id"
        search={{
          labelWidth: 120,
          // collapseRender: () => <></>,
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
        request={request}
        columns={columns}
      />
      <ModalForm
        title="产品详情"
        form={form}
        layout="horizontal"
        width="480px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          let result: any;

          if (currentRow && currentRow.id) {
            value.status = +value.status;
            result = await updateProduct(currentRow.id, value);
          } else {
            result = await createProduct(value);
          }
          if (result.code === 0) {
            message.success('操作成功');
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
              message: '产品名称必填',
            },
          ]}
          width="md"
          name="name"
          placeholder="请输入产品名称"
          label="产品名称"
        />
        <ProFormText
          width="md"
          name="code"
          label="产品编码"
          placeholder="请输入产品编码"
          rules={[
            {
              required: true,
              message: '产品编码必填',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="spec"
          label="规格型号"
          placeholder="请输入规格型号"
          rules={[
            {
              required: true,
              message: '规格型号必填',
            },
          ]}
        />
        {currentRow && currentRow.id && (
          <ProFormRadio.Group
            name="status"
            label="状态"
            options={[
              {
                label: '下架',
                value: 0,
              },
              {
                label: '上架',
                value: 1,
              },
            ]}
          />
          // <ProFormSelect
          //   name="status"
          //   label="状态"
          //   valueEnum={{
          //     '0': '下架',
          //     '1': '上架',
          //   }}
          //   placeholder="请选择当前状态"
          //   rules={[{ required: true, message: '产品状态必选' }]}
          // />
        )}
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
