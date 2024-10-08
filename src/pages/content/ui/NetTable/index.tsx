import {
  BarChartOutlined,
  CaretRightOutlined,
  CheckOutlined,
  CloseOutlined,
  DotChartOutlined,
  PauseOutlined,
  ReloadOutlined,
  VideoCameraFilled,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { MESSAGES_OF_EXTENSION, Z_INDEX_MAIN } from '@root/src/shared/constant';
import generateFakeResponse from '@root/utils/fakeResponse';
import type { TableColumnType } from 'antd';
import { Badge, Drawer, FloatButton, Form, Input, Switch, Table, Tabs, Tag, Tooltip, Typography } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ACTIONS } from '../Context/useStore';
import BaseBtn from './BaseBtn';
import PanelDetail from './PanelDetail';
import Resizer from './Resizer';
import RuleGroups from './Rules';
import TextEditor from './TextEditor';
import useAntdTable from './useAntdTable';
import { useNetTable } from './useNetTable';
import useScroller from './useScroller';
import registerMessageCenter from './registerContentMessage';
interface NetTableProps {
  children?: React.ReactNode;
}

const NetTable: React.FC<NetTableProps> = () => {
  const { state, dispatch, local_state } = useNetTable();
  const [{ selectedRowKeys }, antdTableProps] = useAntdTable();
  const [filter_api_value, set_filter_api_value] = useState('');
  const [loading, setLoading] = useState(false);

  const startMock = (record, bol = true) => {
    dispatch({ type: ACTIONS.TOGGLE_MOCK, payload: { api: record.api, bol } });
  };

  useEffect(() => {
    registerMessageCenter();
  }, []);

  const current_cancel_btn = null;
  let current_confirm_btn = null;

  const toggleRecord = (record, bol = true) => {
    dispatch({
      type: ACTIONS.TOGGLE_RECORD,
      payload: { api: record.api, bol },
    });
  };
  const toggleApp = bol => {
    dispatch({ type: ACTIONS.TOGGLE_APP, payload: bol });
  };

  const setData = (data, record, index) => {
    dispatch({
      type: ACTIONS.SET_DATA,
      payload: {
        api: record.api,
        index,
        data: typeof data == 'string' ? data : JSON.stringify(data),
      },
    });
  };

  const resolveRequest = (record, current = -1) => {
    return dispatch({
      type: ACTIONS.RESOLVE_REQUEST,
      payload: { api: record.api, current },
    });
  };
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const columns: TableColumnType[] = [
    {
      title: '接口',
      dataIndex: 'api',
      key: 'api',
      width: '40%',
      render: text => {
        let item: Partial<URL> = {};
        try {
          item = new URL(text);
        } catch (error) {
          console.log(error);
        }
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
            <Tag bordered={false} color="orange" key="xhr">
              XHR
            </Tag>,
          ],
          [
            'FETCH',
            <Tag bordered={false} color="cyan" key={'fetch'}>
              Fetch
            </Tag>,
          ],
        ]);
        return (
          methods.get(txt) || (
            <Tag bordered={false} color="grey" key="unknown">
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
        let row_extra = null;
        const ref_list = [];
        const items = data?.map((item, index) => {
          const textRef = React.createRef();
          ref_list[index] = textRef;
          return {
            key: index,
            label: '备份' + (index + 1),
            children: (
              <TextEditor
                ref={textRef}
                value={item}
                submit={v => {
                  setData(v, record, index);
                }}
              />
            ),
          };
        });
        row_extra = ref_list?.[record?.current];
        const SingBtn = () => {
          const [loading, setLoading] = useState(false);
          const handleLoading = () => {
            setLoading(true);
            resolveRequest(record);
            setTimeout(() => {
              setLoading(false);
            }, 600);
          };

          return (
            <div className="flex gap-2">
              <BaseBtn
                toolTip="获取数据（前置条件：记录状态）"
                disabled={!record?.enable_record}
                loading={loading}
                onClick={handleLoading}
                icon={<ReloadOutlined />}
              />
              {data?.length && (
                // <BaseBtn
                //   icon={<EditOutlined />}
                //   onClick={e => {
                //     e.stopPropagation();
                //     setChildrenDrawer(true);
                //     set_current_api(record?.api);
                //   }}
                // />
                <BaseBtn
                  toolTip="随机mock"
                  icon={<DotChartOutlined />}
                  onClick={e => {
                    e.stopPropagation();
                    let content = row_extra?.current?.getContent();
                    try {
                      if (typeof content === 'string') {
                        content = JSON.parse(content);
                      }
                      content = generateFakeResponse(content);
                    } catch (error) {
                      console.log('mock error', error);
                    }

                    if (typeof content === 'object') {
                      content = JSON.stringify(content);
                    }
                    console.log('ress:', content);
                    row_extra?.current?.setContent(content);
                  }}
                />
              )}
            </div>
          );
        };
        const onChange = (key: string) => {
          dispatch({
            type: ACTIONS.UPDATE_CURRENT,
            payload: {
              api: record?.api,
              current: key,
            },
          });
        };
        return !items.length ? (
          <SingBtn />
        ) : (
          <Tabs
            activeKey={record?.current}
            tabBarExtraContent={{
              right: <SingBtn />,
            }}
            onEdit={() => {}}
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            indicator={{ size: origin => origin - 20 }}
          />
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

  const handleRefresh = () => {
    // 发送消息到页面
    setTimeout(() => {
      window.postMessage(
        { type: 'INJECT_TO_BACKGROUND', action: MESSAGES_OF_EXTENSION.CLEAR_CACHE },
        window.location.origin,
      );
    }, 0);
  };

  const mockSelectedRows = () => {
    setLoading(true);
    selectedRowKeys.forEach(api => {
      startMock({ api }, true);
    });
    handleRefresh();
  };

  const recordSelectedRows = () => {
    setLoading(true);
    selectedRowKeys.forEach(api => {
      toggleRecord({ api }, true);
    });
    handleRefresh();
  };

  const dataSource = Object.entries(state?.apis_map || {})
    .map(([api, value]: [string, any]) => {
      return {
        key: api,
        ...value,
        api,
        data: value?.data || '',
        loading: false,
      };
    })
    .filter(row => {
      return filter_api_value ? String(row?.api).includes(filter_api_value) : true;
    });

  const [current_api] = useState(dataSource?.[0]?.api || '');
  const current_record = dataSource.find(item => item?.api === current_api);

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
                zIndex: Z_INDEX_MAIN,
              }}
              onClick={e => {
                e?.stopPropagation();
                if (childrenDrawer) {
                  setChildrenDrawer(false);
                }
              }}
              closeIcon={false}
              styles={{
                body: {
                  fontSize: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0 16px',
                  overflowX: 'hidden',
                },
              }}
              extra={
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                  }}>
                  <Tooltip title={local_state.enable ? '插件已开启' : '插件已关闭'}>
                    <Switch
                      style={{
                        transition: 'none',
                      }}
                      value={local_state.enable}
                      onChange={toggleApp}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                    />
                  </Tooltip>
                  {/* <Tooltip title={state.enable ? '插件已开启' : '插件已关闭'}>
                    <BaseBtn icon={<SettingOutlined />} />
                  </Tooltip> */}
                </div>
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
              <div
                style={{
                  position: 'relative',
                }}>
                <div
                  role="div"
                  className="absolute w-full cursor-not-allowed h-[100%] backdrop-blur-sm bg-[rgba(0,0,0,0.2)]"
                  style={{
                    zIndex: Z_INDEX_MAIN + 2,
                    display: local_state?.enable ? 'none' : 'block',
                    marginLeft: -30,
                  }}></div>
                <div role="main-content" className="flex w-full">
                  <div role="main-content-table" className="flex-1 min-w-0 mr-[-16px]">
                    <div
                      role="button"
                      className={classnames('grid sticky p-2 top-0 z-[99] items-center backdrop-blur-sm', {
                        'shadow-lg': isScrolled,
                        'grid-cols-3 gap-[8px]': true,
                      })}>
                      <div className="flex gap-2 items-center">
                        <BaseBtn
                          type="primary"
                          onClick={mockSelectedRows}
                          disabled={!hasSelected}
                          loading={loading}
                          icon={<BarChartOutlined />}>
                          一键模拟
                        </BaseBtn>
                        <BaseBtn
                          onClick={recordSelectedRows}
                          disabled={!hasSelected}
                          danger
                          loading={loading}
                          icon={<CaretRightOutlined />}>
                          一键录制
                        </BaseBtn>

                        <BaseBtn
                          toolTip="停用缓存刷新"
                          onClick={handleRefresh}
                          loading={loading}
                          icon={<ReloadOutlined />}>
                          刷新
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
                        }}>
                        <Form.Item label="筛选" style={{ margin: 0 }}>
                          <Input
                            allowClear
                            placeholder="内容"
                            variant="borderless"
                            onChange={debounce(e => set_filter_api_value(e.target.value))}
                            value={filter_api_value}
                            style={{
                              width: '200px',
                            }}
                          />
                        </Form.Item>
                      </Form>

                      <div className="flex items-center gap-[8px] justify-end">
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
                  </div>
                </div>
                {/* <PanelDetail
                  startMock={startMock}
                  setData={setData}
                  childrenDrawer={childrenDrawer}
                  setChildrenDrawer={setChildrenDrawer}
                  current_record={current_record}
                /> */}
              </div>
            </Drawer>
          );
        }}
      </Resizer>
    </>
  );
};

export default NetTable;
