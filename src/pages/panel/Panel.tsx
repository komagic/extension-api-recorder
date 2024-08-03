import { Card, CardBody, CardHeader } from '@nextui-org/react';
import '@pages/panel/Panel.css';
import React from 'react';
import NetWorkTable from './Table/NetWorkTable';

const Panel: React.FC = () => {
  return (
    <div>
      <Card className="dark h-screen">
        <CardHeader>
          <h1>hello</h1>
        </CardHeader>
        <CardBody>
          <NetWorkTable />
        </CardBody>
      </Card>
    </div>
  );
};

export default Panel;
