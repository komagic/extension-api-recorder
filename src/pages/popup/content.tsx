import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image } from '@nextui-org/react';
import React from 'react';

interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = () => {
  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-lg">API Recorder</p>
        </div>
        <Button size="sm" color="primary" className="ml-auto">
          打开应用
        </Button>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <CardFooter>Shi En</CardFooter>
      <Divider />
    </Card>
  );
};

export default Content;
