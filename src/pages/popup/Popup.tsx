'use client';
import '@pages/popup/Popup.css';
// import useStorage from '@src/shared/hooks/useStorage';
// import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import withSuspense from '@src/shared/hoc/withSuspense';
import { Card, ConfigProvider, theme } from 'antd';

const Popup = () => {
  // const theme = useStorage(exampleThemeStorage);

  return (
    <ConfigProvider
      prefixCls="apirecorder"
      theme={{
        // 1. 单独使用暗色算法
        algorithm: theme.darkAlgorithm,
      }}>
      <Card
        style={{
          borderRadius: 0,
        }}
        className="dar h-full w-full border-radius-0"
        title="API Recorder">
        {/* <Button onClick={handleOpen}>启用</Button>
        <Button onClick={handleDisable}>禁用</Button> */}
      </Card>
    </ConfigProvider>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
