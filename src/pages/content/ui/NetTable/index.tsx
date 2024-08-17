import {
  ApiOutlined,
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
  ReloadOutlined,
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
import React, { useRef, useState } from 'react';
import { ACTIONS } from '../Context/useStore';
import BaseBtn from './BaseBtn';
import { useNetTable } from './useNetTable';
import { TableRowSelection } from 'antd/es/table/interface';
import useAntdTable from './useAntdTable';
import Resizer from './Resizer';
import { debounce } from 'lodash';
import useScroller from './useScroller';
import classnames from 'classnames';
import RuleGroups from './Rules';
interface NetTableProps {
  children?: React.ReactNode;
}

const NetTable: React.FC<NetTableProps> = () => {
  const { state, dispatch } = useNetTable();
  const [loading, setLoading] = useState(false);
  const [{ selectedRowKeys }, antdTableProps] = useAntdTable();
  const [filter_api_value, set_filter_api_value] = useState('');
  const startMock = (record, bol = true) => {
    dispatch({ type: ACTIONS.TOGGLE_MOCK, payload: { api: record.api, bol } });
  };

  const toggleRecord = (record, bol = true) => {
    dispatch({
      type: ACTIONS.TOGGLE_RECORD,
      payload: { api: record.api, bol },
    });
  };
  const toggleApp = bol => {
    dispatch({ type: ACTIONS.TOGGLE_APP, payload: bol });
  };

  const resolveRequest = record => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
    dispatch({
      type: ACTIONS.RESOLVE_REQUEST,
      payload: { api: record.api },
    });
  };

  const columns = [
    {
      title: '接口',
      dataIndex: 'api',
      key: 'api',
      width: '40%',
      render: text => {
        let item = {};
        try {
          item = new URL(text);
        } catch (error) {}
        const regex = new RegExp(`(${filter_api_value})`, 'gi');
        const parts = String(item?.origin + item?.pathname || text).split(regex);
        return (
          <Typography.Text
            style={{
              width: '100%',
            }}
            copyable={{
              text: text,
            }}
            ellipsis={{
              tooltip: text,
              expanded: true,
            }}>
            <span>
              {parts.map((part, index) =>
                part?.toLowerCase() === filter_api_value?.toLowerCase() ? (
                  <span key={index} style={{ color: '#e8b339' }}>
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
            </span>
          </Typography.Text>
        );
      },
    },
    {
      title: '请求',
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
        return (
          methods.get(txt) || (
            <Tag bordered={false} color="grey">
              unknown
            </Tag>
          )
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
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
        return !items.length ? (
          <Tooltip title="单条：获取数据">
            <BaseBtn size="large" loading={loading} onClick={() => resolveRequest(record)} icon={<ReloadOutlined />} />
          </Tooltip>
        ) : (
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
          <div className="flex gap-2">
            <Tooltip title="单条：获取数据">
              <BaseBtn loading={loading} onClick={() => resolveRequest(record)} icon={<ReloadOutlined />} />
            </Tooltip>
            {!record?.enable_record && (
              <Tooltip title="单条：开始记录">
                <BaseBtn onClick={() => toggleRecord(record, true)} icon={<CaretRightOutlined />} />
              </Tooltip>
            )}
            {record?.enable_record && (
              <Tooltip title="单条：停止记录">
                <BaseBtn danger onClick={() => toggleRecord(record, false)} icon={<PauseOutlined />} />
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

  const dataSource = Object.entries(state?.apis_map || {})
    .map(([api, value]) => {
      return {
        key: api,
        ...value,
        api,
        status: {
          ...value,
        },
        data: value?.data || '',
      };
    })
    .filter(row => {
      return filter_api_value ? String(row?.api).includes(filter_api_value) : true;
    });
  console.log('dataSource', dataSource);

  const hasSelected = selectedRowKeys.length > 0;

  // scrollTop
  const { isScrolled } = useScroller(document.querySelector('.apirecorder-drawer-body'));

  return (
    <>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94, insetInlineEnd: 24 + 70 + 70 }}
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
              style={{
                transition: 'height 0s',
              }}
              closeIcon={false}
              bodyStyle={{
                fontSize: 12,
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: 16,
                paddingRight: 16,
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
                  <span style={{ marginRight: 8 }}>
                    <VideoCameraFilled />
                  </span>
                  API Recorder
                </span>
              }
              placement="bottom"
              onClose={() => setVisible(false)}
              open={visible}>
              <>
                <div
                  role="mask"
                  className="absolute w-full cursor-not-allowed h-[100%] z-[101] backdrop-blur-sm bg-[rgba(0,0,0,0.2)]"
                  style={{
                    zIndex: 100,
                    display: state?.enable ? 'none' : 'block',
                    marginLeft: -30,
                  }}></div>
                <div
                  className={classnames('flex p-4 gap-2 sticky top-0 z-[99] items-center backdrop-blur-sm', {
                    'shadow-lg': isScrolled,
                  })}>
                  <div className="flex gap-2 items-center">
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
                    <div
                      style={{
                        width: 100,
                      }}>
                      {`已选择 ${selectedRowKeys.length} 个`}
                    </div>
                  </div>
                  <Form
                    style={{
                      flex: 1,
                      justifySelf: 'end',
                    }}>
                    <Form.Item label="筛选" style={{ margin: 0 }}>
                      <Input
                        allowClear
                        placeholder="内容"
                        variant="borderless"
                        onChange={debounce(e => set_filter_api_value(e.target.value))}
                        value={filter_api_value}
                        style={{
                          alignSelf: 'center',
                          width: '200px',
                        }}
                      />
                    </Form.Item>
                  </Form>

                  <div className="flex items-center gap-2">
                    {/* <BaseBtn
                  
                    onClick={() => {}} loading={loading} icon={<ApiOutlined />}>
                      录入规则
                    </BaseBtn> */}
                    <RuleGroups />
                  </div>
                </div>
                <Table
                  style={{
                    transition: 'none!important',
                  }}
                  columns={columns}
                  dataSource={dataSource}
                  {...antdTableProps}
                />
              </>
            </Drawer>
          );
        }}
      </Resizer>
    </>
  );
};

export default NetTable;
