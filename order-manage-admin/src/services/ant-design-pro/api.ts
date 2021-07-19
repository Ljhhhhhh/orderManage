// @ts-ignore
/* eslint-disable */
import { extend } from 'umi-request';

const request = extend({
  prefix: 'http://127.0.0.1:3000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
});

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser() {
  return request<API.LoginResult>('/users/me', {
    method: 'GET',
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function fetchUser(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const result: any = await request<API.UserList>('/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
  return {
    data: result.data.list,
    success: true,
    total: result.data.total,
  };
}

export async function updateUser(id: string, body: { status?: 0 | 1; password?: string }) {
  return request<API.UserList>(`/users/${id}`, {
    method: 'PUT',
    data: body,
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function createUser(data?: { [key: string]: any }) {
  return request<API.RuleListItem>('/users/register', {
    method: 'POST',
    data,
  });
}

/** 获取规则列表 GET /api/rule */
export async function fetchCustomer(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const result: any = await request<API.CurrentUser>('/customer/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
  return {
    data: result.data.list,
    success: true,
    total: result.data.total,
  };
}

/** 获取规则列表 GET /api/rule */
export async function fetchOrder(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const result: any = await request<API.CurrentUser>('/order', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
  return {
    data: result.data.list,
    success: true,
    total: result.data.total,
  };
}

export async function orderDetail(orderId: string) {
  return request(`/order/${orderId}`, {
    method: 'GET',
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
