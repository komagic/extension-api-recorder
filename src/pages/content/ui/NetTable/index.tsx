import {
  BarChartOutlined,
  CaretRightOutlined,
  CheckCircleTwoTone,
  CheckOutlined,
  CloseCircleTwoTone,
  CloseOutlined,
  CopyTwoTone,
  DeleteTwoTone,
  EditOutlined,
  EditTwoTone,
  PauseOutlined,
  PlusCircleTwoTone,
  ReloadOutlined,
  SettingOutlined,
  VideoCameraFilled,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Z_INDEX_MAIN } from '@root/src/constant';
import { Badge, Card, Drawer, FloatButton, Form, Input, Switch, Table, Tabs, Tag, Tooltip, Typography } from 'antd';
import classnames from 'classnames';
import { JsonEditor } from 'json-edit-react';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { ACTIONS } from '../Context/useStore';
import BaseBtn from './BaseBtn';
import Resizer from './Resizer';
import RuleGroups from './Rules';
import useAntdTable from './useAntdTable';
import { useNetTable } from './useNetTable';
import useScroller from './useScroller';
interface NetTableProps {
  children?: React.ReactNode;
}

function JsonCustomerEditor(props) {
  let parsed = {};
  try {
    parsed = JSON.parse(props.item);
  } catch (error) {}
  return (
    <div onClick={e => e.stopPropagation()}>
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
        className="custom-json-editor"
        collapse={props.collapse || 0}
        setData={props.setData}
      />
    </div>
  );
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

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
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
          return {
            key: index,
            label: '备份' + (index + 1),
            children: <JsonCustomerEditor item={item} setData={d => setData(d, record, index)} />,
          };
        });

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
              <Tooltip title="单条：获取数据">
                <BaseBtn loading={loading} onClick={handleLoading} icon={<ReloadOutlined />} />
              </Tooltip>
              {data?.length && (
                <BaseBtn
                  icon={<EditOutlined />}
                  onClick={e => {
                    e.stopPropagation();
                    setChildrenDrawer(true);
                    set_current_api(record?.api);
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
        loading: false,
      };
    })
    .filter(row => {
      return filter_api_value ? String(row?.api).includes(filter_api_value) : true;
    });

  const [current_api, set_current_api] = useState(dataSource?.[0]?.api || '');
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
                },
              }}
              extra={
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                  }}>
                  <Tooltip title={state.enable ? '插件已开启' : '插件已关闭'}>
                    <Switch
                      style={{
                        transition: 'none',
                      }}
                      value={state.enable}
                      onChange={toggleApp}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                    />
                  </Tooltip>
                  <Tooltip title={state.enable ? '插件已开启' : '插件已关闭'}>
                    <BaseBtn icon={<SettingOutlined />} />
                  </Tooltip>
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
                  role="mask"
                  className="absolute w-full cursor-not-allowed h-[100%] backdrop-blur-sm bg-[rgba(0,0,0,0.2)]"
                  style={{
                    zIndex: Z_INDEX_MAIN + 2,
                    display: state?.enable ? 'none' : 'block',
                    marginLeft: -30,
                  }}></div>
                <div role="main-content" className="flex w-full">
                  <div role="main-content-table" className="flex-1 min-w-0 mr-[-16px]">
                    <div
                      className={classnames('grid sticky p-2 top-0 z-[99] items-center backdrop-blur-sm', {
                        'shadow-lg': isScrolled,
                        'grid-cols-3 gap-2': true,
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

                      <div className="flex items-center gap-2 justify-end">
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
                <div
                  onBlur={e => {
                    console.log('onBlur', onblur);
                    e.stopPropagation();
                    setChildrenDrawer(false);
                  }}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  className=" flex-1 min-w-0"
                  style={{
                    position: 'absolute',
                    zIndex: Z_INDEX_MAIN + 1,
                    width: '50%',
                    right: 0,
                    top: 0,
                    height: '100%',
                    transition: 'transform 0.4s',
                    transform: childrenDrawer ? 'translateX(0)' : 'translateX(120%)',
                  }}>
                  <Card
                    title={'接口：' + current_record?.api}
                    extra={<CloseOutlined onClick={() => setChildrenDrawer(false)} />}
                    className="h-full shadow-md"
                    style={{ borderRadius: 0 }}>
                    <div>
                      <div className="pb-4 flex gap-2">
                        {!current_record?.enable_mock ? (
                          <BaseBtn
                            type="primary"
                            onClick={() => startMock(current_record, true)}
                            icon={<BarChartOutlined />}>
                            模拟
                          </BaseBtn>
                        ) : (
                          <BaseBtn
                            type="primary"
                            danger
                            onClick={() => startMock(current_record, false)}
                            icon={<BarChartOutlined />}>
                            暂停
                          </BaseBtn>
                        )}

                        <BaseBtn
                          type="primary"
                          disabled
                          danger
                          onClick={() => startMock(current_record, false)}
                          icon={<BarChartOutlined />}>
                          修改请求
                        </BaseBtn>
                      </div>
                      <JsonCustomerEditor
                        item={current_record?.data?.[current_record?.current]}
                        collapse={3}
                        setData={d => setData(d, current_record, current_record?.current)}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </Drawer>
          );
        }}
      </Resizer>
    </>
  );
};

export default NetTable;
