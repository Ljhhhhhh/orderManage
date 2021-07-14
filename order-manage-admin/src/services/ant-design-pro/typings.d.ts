// @ts-ignore
/* eslint-disable */

declare namespace API {
  enum RoleType {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SALESMAN = 'SALESMAN',
    PRODUCTION = 'PRODUCTION',
  }

  type CurrentUser = {
    username: string;
    token: string;
    role: RoleType;
    id: string;
    phone?: string;
    status: 0 | 1;
  };

  type LoginResult = {
    code?: number;
    data: CurrentUser;
    message?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type TCustomer = {
    id: string;
    username: string;
    code: string;
    linkName: string;
    phone: string;
    address: string;
    remark: string;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type UserList = {
    data?: CurrentUser[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
