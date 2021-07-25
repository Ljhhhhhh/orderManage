import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { orderDetail, fetchProduct, updateOrder } from '@/services/ant-design-pro/api';
import { Card, Row, Col, Tag, Table, Button, Space, Radio, message } from 'antd';
import { history, useModel } from 'umi';
import { useReactToPrint } from 'react-to-print';
import './style.less';

const printTypeList = [
  {
    label: '生产单',
    value: 1,
  },
  {
    label: '财务单',
    value: 2,
  },
];

const financeList = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (k: any, d: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '产品编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '产品数量',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '规格型号',
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '价格体系',
    dataIndex: 'discount',
    key: 'discount',
  },
  {
    width: 280,
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
];

const productionList = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (k: any, d: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '产品编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '产品数量',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '规格型号',
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    width: 280,
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
];

const Detail: React.FunctionComponent = () => {
  const [list, setList] = useState<any>([]);
  const [info, setInfo] = useState<any>({});
  const [salesman, setSalesman] = useState<any>({});
  const [customer, setCustomer] = useState<any>({});
  const [printType, setPrintType] = useState<number>(1);
  const [columns, setColumns] = useState<any[]>();
  const { initialState } = useModel('@@initialState');

  const contentRef = useRef<any>(null);
  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    if (printType === 1) {
      setColumns(productionList);
    } else {
      setColumns(financeList);
    }
  }, [printType]);

  const getDetail = async () => {
    const productResult: any = await fetchProduct({
      pageSize: 99999,
    });
    const productList: any[] = productResult.data;
    const orderId = history.location.pathname.substr(7);
    const result = await orderDetail(orderId);
    const { code, data } = result;
    if (code === 0) {
      const o1 = data[0];
      const fInfo = {
        createTime: o1.createTime,
        updateTime: o1.updateTime,
        status: o1.status,
      };
      setInfo(fInfo);
      setCustomer(o1.customer);
      setSalesman(o1.salesman);
      console.log(data, 'data--');
      data.forEach((item: any) => {
        const k = productList.find((o: any) => o.id === item.productId);
        item.name = k.name;
        item.code = k.code;
        item.spec = k.spec;
        item.category = k.category;
      });
      setList(data);
    }
  };

  const changeStatus = async (status: number) => {
    const customerId = list[0].customerId;
    const newList = [...list];
    newList.forEach((item) => {
      item.status = status;
    });
    const id = history.location.pathname.substr(7);
    const { code, data } = (await updateOrder(id, {
      customerId,
      productList: newList,
    })) as any;
    if (code === 0) {
      message.success('操作成功');
      setInfo({
        ...info,
        status,
      });
    } else {
      message.error('操作失败');
    }
    console.log(code, data);
    // const [err, data] = await request(`/order/${this.id}`, 'put', {
    //   customerId,
    //   productList: newList,
    // })
    // if (!err) {
    //   this.status = status;
    // }
  };

  const StatusTag: React.FC<any> = () => {
    let color, msg;
    switch (info.status) {
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
  };

  const printOrder = useReactToPrint({
    content: () => contentRef.current,
  });

  return (
    <PageContainer>
      <div ref={contentRef}>
        <Row gutter={12} className="info-container">
          <Col span={24} xl={18}>
            <Card hoverable title="客户信息">
              <Row>
                <Col span={12}>
                  <div className="info">
                    <span className="title">客户姓名：</span>
                    <span className="value">{customer.username}</span>
                  </div>
                </Col>
                {initialState?.currentUser?.role === 'ADMIN' && (
                  <>
                    <Col span={12}>
                      <div className="info">
                        <span className="title">联系人：</span>
                        <span className="value">{customer.linkName}</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="info">
                        <span className="title">联系电话</span>
                        <span className="value">{customer.phone}</span>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="info">
                        <span className="title">客户地址</span>
                        <span className="value">{customer.address}</span>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            </Card>
          </Col>
          <Col span={24} xl={6}>
            <Card hoverable title="其他信息">
              <Row>
                <Col span={24}>
                  <div className="info">
                    <span className="title">销售姓名：</span>
                    <span className="value">{salesman.username}</span>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="info">
                    <span className="title">销售电话：</span>
                    <span className="value">{customer.phone}</span>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="info">
                    <span className="title">创建时间：</span>
                    <span className="value">{info.createTime}</span>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="info">
                    <span className="title">更新时间：</span>
                    <span className="value">{info.updateTime}</span>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {list.length && (
          <Card hoverable title="产品明细" extra={<StatusTag />}>
            <Table pagination={false} rowKey="id" columns={columns} dataSource={list} />
          </Card>
        )}
      </div>
      <Row className="print-button" gutter={12}>
        {initialState?.currentUser?.role === 'ADMIN' && (
          <Col>
            <Radio.Group
              options={printTypeList}
              value={printType}
              onChange={(e) => {
                setPrintType(e.target.value);
              }}
              size="large"
            />
          </Col>
        )}
        <Col>
          <Button onClick={printOrder} type="primary">
            打印订单
          </Button>
        </Col>
        <Col>
          {info.status === 0 && (
            <Button
              onClick={() => {
                changeStatus(1);
              }}
              type="primary"
            >
              更新为生产中
            </Button>
          )}
          {info.status === 1 && (
            <Button
              onClick={() => {
                changeStatus(2);
              }}
              type="primary"
            >
              更新为待发货
            </Button>
          )}
          {info.status === 2 && (
            <Button
              onClick={() => {
                changeStatus(3);
              }}
              type="primary"
            >
              更新为已发货
            </Button>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Detail;
