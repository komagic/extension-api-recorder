import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  CopyTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  PlusCircleTwoTone,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Drawer, FloatButton, Table, Tabs, Tag } from 'antd';
import { JsonEditor } from 'json-edit-react';
import React, { useCallback, useState } from 'react';
import { Actions } from '../Context/useStore';
import BaseBtn from './BaseBtn';
import { useNetTable } from './useNetTable';
interface NetTableProps {
  children?: React.ReactNode;
}

const NetTable: React.FC<NetTableProps> = () => {
  const { state, dispatch } = useNetTable();
  const startMock = record => {
    dispatch({ type: Actions.START_MOCK, payload: { api: record.api } });
  };
  const columns = [
    { title: '接口', dataIndex: 'api', key: 'api' },
    { title: '请求方式', dataIndex: 'method', key: 'method' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => {
        return text;
      },
    },
    {
      title: '数据',
      dataIndex: 'data',
      key: 'data',
      render: (data, record) => {
        const items = data?.map((item, index) => {
          let parsed = {};
          try {
            parsed = JSON.parse(item);
          } catch (error) {}
          const setData = data => {
            dispatch({
              type: Actions.SET_DATA,
              payload: {
                api: record.api,
                index,
                data: typeof data == 'string' ? data : JSON.stringify(data),
              },
            });
          };
          return {
            key: index,
            label: '备份' + (index + 1),
            children: (
              <JsonEditor
                theme={'default'}
                icons={{
                  copy: <CopyTwoTone />,
                  edit: <EditTwoTone />,
                  delete: <DeleteTwoTone />,
                  add: <PlusCircleTwoTone />,
                  ok: <CheckCircleTwoTone />,
                  cancel: <CloseCircleTwoTone />,
                }}
                rootName="response "
                data={parsed}
                collapse={1}
                setData={setData}
              />
            ),
          };
        });
        const onChange = (key: string) => {
          console.log(key);
        };
        return (
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} indicator={{ size: origin => origin - 20 }} />
        );
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <div className="flex gap-3">
            <BaseBtn onClick={() => startMock(record)}>开始mock</BaseBtn>
            <BaseBtn>开始录制</BaseBtn>
          </div>
        );
      },
    },
  ];
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!visible);
  };

  const dataSource = Object.entries(state.apis_map).map(([api, value]) => {
    return {
      api,
      status: value?.enable_mock || value?.enable_record || '-',
      data: value?.data || '',
    };
  });

  return (
    <>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={handleClick}
        icon={<VideoCameraOutlined />}
      />
      <Drawer
        extra={<BaseBtn size="middle">启用</BaseBtn>}
        title="API Recorder"
        placement="bottom"
        onClose={() => setVisible(false)}
        open={visible}>
        <Table size="small" columns={columns} dataSource={dataSource} />
      </Drawer>
    </>
  );
};

export default NetTable;
