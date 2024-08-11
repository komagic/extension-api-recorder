import { ConfigProvider } from 'antd';
import { StoreProvider } from './Context/useStore';
import NetTable from './NetTable';
export default function App() {
  return (
    <StoreProvider>
      <ConfigProvider prefixCls="apirecorder" theme={{}}>
        <NetTable />
      </ConfigProvider>
    </StoreProvider>
  );
}
