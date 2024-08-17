import classnames from 'classnames';
import { throttle } from 'lodash';
import React from 'react';
import { Resizable } from 'react-resizable';
import { ACTIONS, useStore } from '../Context/useStore';
import { useMemoizedFn } from 'ahooks';

const ResizeHandle = React.forwardRef(({ handleAxis, ...props }, ref) => {
  return <div ref={ref} {...props} className={classnames(`handle-${handleAxis}`, `api-recorder-resize-handler`)}></div>;
});

const Resizer = ({ children, ...rest }: { children: (args: any) => any; [key in string]: any }) => {
  const { state, dispatch } = useStore();
  const clientHeight = document.body.clientHeight;

  let height = state.height || clientHeight / 2;

  const onResize = throttle((e: any, direction: any, ref: any, d: any) => {
    /* resize 之前的值 */

    const ratio = Math.min(Math.max(e.clientY / clientHeight, 0.05), 0.92);
    const h = Math.floor(clientHeight * (1 - ratio));
    if (height != h) {
      console.log('resize', h);
      dispatch({
        type: ACTIONS.UPDATE_STATE,
        payload: { height: h },
      });
    }
  });

  // 克隆子组件并传递额外的props

  return (
    <Resizable
      height={height}
      width={Infinity}
      axis="y"
      minConstraints={[Infinity, 100]}
      maxConstraints={[Infinity, clientHeight]}
      handle={<ResizeHandle />}
      onResize={onResize}
      {...rest}>
      {children({ height })}
    </Resizable>
  );
};

export default Resizer;
