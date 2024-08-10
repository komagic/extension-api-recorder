import React from 'react';
import { Tabs, Tab, Card, CardBody, CardHeader, Textarea, Input, Button } from '@nextui-org/react';
import { EditOutlined } from '@ant-design/icons';
import BtnIcon from './BtnIcon';
import useModal from '../Context/useModal';
import { useStore } from '../Context/useStore';
import OpenModal from './OpenModal';

export default function TabsComponent() {
  const [text_value, setValue] = React.useState('');
  const { onOpen } = useStore();
  const handleOnOpen = () => {
    const p = <div>1</div>;
    onOpen(p);
  };
  return (
    <div className="flex w-full flex-col">
      <Tabs disableAnimation size="sm" placement="start" variant="underlined" color="warning" disabledKeys={['music']}>
        {[1, 2, 3].map((c, i) => {
          return (
            <Tab key={i} title="Photos" className="flex-1">
              <Card className="max-h-100 w-full flex-1">
                <Textarea
                  label="Description"
                  variant="underlined"
                  placeholder="Enter your description"
                  className="flex-1 w-full"
                  classNames={{
                    base: 'max-w-xs w-full',
                  }}
                  endContent={
                    <OpenModal
                      btn={state => {
                        return (
                          <BtnIcon onPress={state.onOpen}>
                            <EditOutlined />
                          </BtnIcon>
                        );
                      }}
                    />
                  }
                />
              </Card>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}
