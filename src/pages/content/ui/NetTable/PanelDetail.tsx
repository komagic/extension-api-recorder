import { BarChartOutlined, CloseOutlined } from '@ant-design/icons';
import { Z_INDEX_MAIN } from '@root/src/shared/constant';
import extractUrlParams from '@root/utils/http/extraUrl';
import { useState } from 'react';
import { logger } from '@root/utils/log';
import { Card } from 'antd';
import BaseBtn from './BaseBtn';
import TextEditor from './TextEditor';

export default function PanelDetail(props) {
  const [val] = useState('response');
  const web_requests = window['_api_recorder_requests_'];
  const api = props.current_record?.api;
  const json_str = props.current_record?.data?.[props.current_record?.current];
  console.log('jsoncurrent_record', props, json_str);
  let params, body;
  if (val == 'request') {
    try {
      if (web_requests[api]) {
        params = extractUrlParams(web_requests[api]?.request?.url);
        body = web_requests[api]?.request?.body;
      }
      logger('params', params, body);
    } catch (error) {
      console.error('error', error);
    }
  }

  return (
    <div
      className="flex-1 min-w-0"
      role="select"
      onClick={e => {
        e.stopPropagation();
      }}
      aria-hidden="true"
      style={{
        position: 'absolute',
        zIndex: Z_INDEX_MAIN + 1,
        width: '50%',
        right: 0,
        top: 0,
        height: '100%',
        transition: 'transform 0.4s',
        marginRight: -16,
        transform: props.childrenDrawer ? 'translateX(0)' : 'translateX(120%)',
      }}>
      <Card
        title={'接口：' + props.current_record?.api}
        extra={<CloseOutlined onClick={() => props.setChildrenDrawer(false)} />}
        className="h-full shadow-md"
        style={{
          borderRadius: 0,
        }}>
        <div>
          <div className="pb-[16px] flex gap-[8px]">
            {!props.current_record?.enable_mock ? (
              <BaseBtn
                toolTip="模拟开启"
                type="primary"
                onClick={() => props.startMock(props.current_record, true)}
                icon={<BarChartOutlined />}>
                模拟
              </BaseBtn>
            ) : (
              <BaseBtn
                toolTip="模拟暂停"
                type="primary"
                danger
                onClick={() => props.startMock(props.current_record, false)}
                icon={<BarChartOutlined />}>
                暂停
              </BaseBtn>
            )}
          </div>
          {val === 'response' && (
            // <JsonCustomerEditor
            //   item={json}
            //   collapse={3}
            //   setData={d => props.setData(d, props.current_record, props.current_record?.current)}
            // />
            <TextEditor
              key="response_editor"
              value={json_str}
              submit={v => {
                props.setData(v, props.current_record, props.current_record?.current);
              }}
              autoSize={true}
            />
          )}
          {/* {
            val==='request'&& (<>
            {params && <JsonCustomerEditor
              item={params}
              setData={d => {}}
            />}
             {body && <JsonCustomerEditor
              item={body}
              setData={d => {}}
            />}
            </>)
          } */}
        </div>
      </Card>
    </div>
  );
}
