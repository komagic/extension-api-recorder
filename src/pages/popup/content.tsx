import PlayIcon from '@assets/img/play.svg';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Image } from '@nextui-org/react';
import React from 'react';
import Icon from './Icon';
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
          <Chip color="warning" variant="shadow">
            API Recorder
          </Chip>
        </div>
        <Button size="sm" color="primary" className="ml-auto">
          打开应用
        </Button>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2 gap-2">
          <Button startContent={<Icon icon={PlayIcon} />}>开始记录</Button>
        </div>
      </CardBody>
      <CardFooter>
        <p>Mr.ShiEn</p>
      </CardFooter>
      <Divider />
    </Card>
  );
};

export default Content;
