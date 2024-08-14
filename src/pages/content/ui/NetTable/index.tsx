import {
  BarChartOutlined,
  CaretRightOutlined,
  CheckCircleTwoTone,
  CheckOutlined,
  CloseCircleTwoTone,
  CloseOutlined,
  CopyTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  PauseOutlined,
  PlusCircleTwoTone,
  VideoCameraFilled,
  VideoCameraOutlined,
  VideoCameraTwoTone,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Drawer,
  Flex,
  FloatButton,
  Form,
  Input,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { JsonEditor } from 'json-edit-react';
import React, { useState } from 'react';
import { ACTIONS } from '../Context/useStore';
import BaseBtn from './BaseBtn';
import { useNetTable } from './useNetTable';
import { TableRowSelection } from 'antd/es/table/interface';
import useAntdTable from './useAntdTable';
import Resizer from './Resizer';
interface NetTableProps {
  children?: React.ReactNode;
}

const NetTable: React.FC<NetTableProps> = () => {
  const { state, dispatch } = useNetTable();
  const [loading, setLoading] = useState(false);
  const [{ selectedRowKeys }, antdTableProps] = useAntdTable();
  const startMock = (record, bol = true) => {
    dispatch({ type: ACTIONS.TOGGLE_MOCK, payload: { api: record.api, bol } });
  };

  const toggleRecord = (record, bol = true) => {
    dispatch({ type: ACTIONS.TOGGLE_RECORD, payload: { api: record.api, bol } });
  };
  const toggleApp = bol => {
    dispatch({ type: ACTIONS.TOGGLE_APP, payload: bol });
  };
  const columns = [
    {
      title: '接口',
      dataIndex: 'api',
      key: 'api',
      width: 250,

      render: txt => {
        return (
          <Typography.Text
            style={{
              width: 250,
            }}
            copyable
            ellipsis={{
              tooltip: txt,
            }}>
            {txt}
          </Typography.Text>
        );
      },
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: txt => {
        const methods = new Map([
          [
            'XHR',
            <Tag bordered={false} color="orange">
              XHR
            </Tag>,
          ],
          [
            'FETCH',
            <Tag bordered={false} color="cyan">
              Fetch
            </Tag>,
          ],
        ]);
        return methods.get(txt);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (record, row) => {
        return (
          <>
            {row?.enable_mock && <Badge status="processing" text="正在mock" />}
            {row?.enable_record && <Badge status="error" text="正在记录" />}
          </>
        );
      },
    },
    {
      title: '数据',
      dataIndex: 'data',
      width: 400,
      key: 'data',
      render: (data, record) => {
        const items = data?.map((item, index) => {
          let parsed = {};
          try {
            parsed = JSON.parse(item);
          } catch (error) {}
          const setData = data => {
            dispatch({
              type: ACTIONS.SET_DATA,
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
                collapse={0}
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
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: 4,
            }}>
            {!record?.enable_record && (
              <Tooltip title="单条：开始记录">
                <BaseBtn onClick={() => toggleRecord(record, true)} icon={<CaretRightOutlined />} type="primary" />
              </Tooltip>
            )}
            {record?.enable_record && (
              <Tooltip title="单条：停止记录">
                <BaseBtn danger onClick={() => toggleRecord(record, false)} type="primary" icon={<PauseOutlined />} />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!visible);
  };

  const mockSelectedRows = () => {
    selectedRowKeys.forEach(api => {
      startMock({ api }, true);
    });
  };

  const recordSelectedRows = () => {
    selectedRowKeys.forEach(api => {
      toggleRecord({ api }, true);
    });
  };

  const dataSource = Object.entries(state.apis_map).map(([api, value]) => {
    return {
      key: api,
      ...value,
      api,
      status: {
        ...value,
      },
      data: value?.data || '',
    };
  });
  console.log('dataSource', dataSource);

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={handleClick}
        icon={<VideoCameraOutlined />}
      />
      <Resizer>
        {({ height }) => {
          return (
            <Drawer
              headerStyle={{
                height: 48,
              }}
              height={height}
              closeIcon={false}
              bodyStyle={{
                fontSize: 12,
                display: 'flex',
                flexDirection: 'column',

                paddingTop: 0,
              }}
              extra={
                <Tooltip title={state.enable ? '插件已开启' : '插件已关闭'}>
                  <Switch
                    value={state.enable}
                    onChange={toggleApp}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Tooltip>
              }
              title={
                <span
                  style={{
                    fontSize: 16,
                    lineHeight: '1rem',
                  }}>
                  API Recorder
                  <span style={{ marginLeft: 8 }}>
                    <VideoCameraFilled />
                  </span>
                </span>
              }
              placement="bottom"
              onClose={() => setVisible(false)}
              open={visible}>
              <>
                <div
                  role="mask"
                  style={{
                    display: state.enable ? 'none' : 'block',
                    position: 'absolute',
                    background: 'rgba(0,0,0,0.2)',
                    width: '120%',
                    cursor: 'not-allowed',
                    marginLeft: -30,
                    height: '100%',
                    zIndex: 10000,
                    backdropFilter: 'blur(1px)',
                    transition: 'all .3s ease-in-out',
                  }}></div>
                <div
                  style={{
                    display: 'flex',
                    padding: `12px 0`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    alignItems: 'center',
                    backdropFilter: 'blur(5px)',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      flex: 1,
                    }}>
                    <BaseBtn
                      type="primary"
                      onClick={mockSelectedRows}
                      disabled={!hasSelected}
                      loading={loading}
                      icon={<BarChartOutlined />}>
                      一键mock
                    </BaseBtn>
                    <BaseBtn
                      onClick={recordSelectedRows}
                      disabled={!hasSelected}
                      danger
                      loading={loading}
                      icon={<CaretRightOutlined />}>
                      一键录制
                    </BaseBtn>
                  </div>
                  <Form
                    style={{
                      flex: 1,
                      justifySelf: 'end',
                    }}>
                    <Form.Item label="筛选" style={{ margin: 0 }}>
                      <Input
                        placeholder="搜索"
                        variant="borderless"
                        style={{
                          alignSelf: 'center',
                          width: '200px',
                        }}
                      />
                    </Form.Item>
                  </Form>
                  <div
                    style={{
                      width: 100,
                    }}>
                    {' '}
                    {hasSelected ? `已选择 ${selectedRowKeys.length} 个` : null}
                  </div>
                </div>
                <Table columns={columns} dataSource={dataSource} {...antdTableProps} />
              </>
            </Drawer>
          );
        }}
      </Resizer>
    </>
  );
};

export default NetTable;
