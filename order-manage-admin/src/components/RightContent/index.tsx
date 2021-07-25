import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import { Popconfirm } from 'antd';
import { history, Link, setLocale } from 'umi';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <Popconfirm
        title="确定退出登录？"
        onConfirm={() => {
          setInitialState({
            ...initialState,
            currentUser: undefined,
          });
          localStorage.removeItem('token');
          history.replace('/user/login');
        }}
      >
        <span className={styles.action}>{initialState.currentUser?.username}</span>
      </Popconfirm>
    </Space>
  );
};
export default GlobalHeaderRight;
