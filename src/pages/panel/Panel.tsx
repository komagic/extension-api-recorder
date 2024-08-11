import { Button, Card, CardBody, CardHeader, Snippet } from '@nextui-org/react';
import '@pages/panel/Panel.css';
import React, { useEffect } from 'react';
import NetWorkTable from './Table/NetWorkTable';
import OpenModal from './Table/components/OpenModal';
import communication from '@root/src/core/Communication';
import { MessageNames, PortNames } from '@root/src/core/constants';
import url from 'url';
import { data } from 'autoprefixer';

const Panel: React.FC = () => {
  // useEffect(() => {
  //   const port = communication.connect({ name: PortNames.Content });
  //   // 监听从 content script 转发过来的消息

  //   port.onMessage.addListener(msg => {
  //     console.log('Received message from content script:', msg);
  //     if (msg.from === PortNames.Content) {
  //       dispatch({
  //         type: MessageNames.XHR,
  //         payload: msg.data,
  //         url: msg.url,
  //       });

  //     }
  //   });
  //   return ()=>{
  //     port.disconnect()
  //   }
  // }, []);

  return (
    <div>
      {/* <Card className="dark h-screen">
        <CardHeader>
          <h1>域名：</h1>
          <OpenModal />
        </CardHeader>
        <CardBody>
          <NetWorkTable />
        </CardBody>
      </Card> */}
    </div>
  );
};

export default () => {
  return (
    <StoreProvider>
      <Panel />
    </StoreProvider>
  );
};
