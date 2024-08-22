'use client';
import { ClearOutlined ,CaretRightOutlined, VideoCameraFilled } from '@ant-design/icons';
import '@pages/popup/Popup.css';
// import useStorage from '@src/shared/hooks/useStorage';
// import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import withSuspense from '@src/shared/hoc/withSuspense';
import { Button, Card, ConfigProvider, Popconfirm, Popover, theme } from 'antd';
import { useCallback } from 'react';
import AppStore from '../content/ui/Context/AppStore';
import packagejson from '@root/package.json';

const Popup = () => {
  // const theme = useStorage(exampleThemeStorage);
const handleOpen = useCallback(
  () => {
    
  },
  [],
)

const handleClear = () => {
  AppStore.clear();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { action: 'recorder:clearIndexedDB' });
      chrome.tabs.reload(tabId);
    }
});
}


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
        styles={{
          body:{
          paddingTop: 0,
          }
        }}
        className="dar h-full w-full border-radius-0"
        title={ <span
          style={{
            fontSize: 16,
            lineHeight: '1rem',
          }}>
          <span style={{ marginRight: 8 }}>
            <VideoCameraFilled />
          </span>
          API Recorder <span style={{
            fontSize: 12,
            marginLeft: 8,
            color:'rgba(253,253,253,0.2)',
            fontStyle:'italic'
          }}>{packagejson?.version}</span>
        </span>}>
          <p>轻量化、快捷HTTP拦截器</p>
     <div className='grid grid-cols-2 gap-2'>
         <Button size='small' type='primary' icon={<CaretRightOutlined />}  onClick={handleOpen}>全局启用</Button>
        
        <Popconfirm cancelText={
          '取消'
        } okText='确定' title="确定清空所有数据缓存吗？"  onConfirm={handleClear}>
        <Button size='small' icon={<ClearOutlined />} danger >清空缓存</Button>
        </Popconfirm>
     </div>
      </Card>
    </ConfigProvider>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
