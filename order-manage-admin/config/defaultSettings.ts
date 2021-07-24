import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  menu: {
    locale: false,
  },
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '慈星订单管理系统',
  pwa: false,
  iconfontUrl: '',
};

export default Settings;
