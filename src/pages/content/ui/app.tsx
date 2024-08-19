import { ConfigProvider, theme } from 'antd';
import { StoreProvider } from './Context/useStore';
import NetTable from './NetTable';
export default function App() {
  return (
    <StoreProvider>
      <ConfigProvider
        prefixCls="apirecorder"
        theme={{
          // 1. 单独使用暗色算法
          algorithm: theme.darkAlgorithm,
        }}>
        <NetTable />
      </ConfigProvider>
    </StoreProvider>
  );
}
