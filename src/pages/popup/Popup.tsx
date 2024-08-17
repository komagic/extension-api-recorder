'use client';
import React from 'react';
import '@pages/popup/Popup.css';
// import useStorage from '@src/shared/hooks/useStorage';
// import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { Card, ConfigProvider, theme } from 'antd';

import { Button } from 'antd';
import { XHR_ROOT, PANEL_ROOT } from '@root/src/constant';
const Popup = () => {
  // const theme = useStorage(exampleThemeStorage);
  const handleOpen = () => {
    chrome.action.enable();
  };
  const handleDisable = () => {
    document.getElementById(XHR_ROOT)?.remove();
    document.getElementById(PANEL_ROOT)?.remove();
    chrome.action.disable();
    chrome.tabs.reload();

    setTimeout(() => {}, 100);
  };

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
