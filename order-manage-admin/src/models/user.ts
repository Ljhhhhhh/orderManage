import type { Effect, Reducer } from 'umi';

import { currentUser, login } from '@/services/ant-design-pro/api';

export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SALESMAN = 'SALESMAN',
  PRODUCTION = 'PRODUCTION',
}

export type CurrentUser = {
  username: string;
  token: string;
  role: RoleType;
  id: string;
  phone?: string;
  status: 0 | 1;
};

export type UserModelState = {
  currentUser?: CurrentUser;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    // fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: undefined,
  },

  effects: {
    // *fetch(_, { call, put }) {
    //   const response = yield call(queryUsers);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(currentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
