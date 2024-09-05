import classnames from 'classnames';
import { throttle } from 'lodash';
import React, { RefObject } from 'react';
import { Resizable } from 'react-resizable';
import { ACTIONS, useStore } from '../Context/useStore';

const ResizeHandle = React.forwardRef(({ ...props }, ref:RefObject<HTMLDivElement>) => {
  return <div ref={ref} {...props} className={classnames(`handle-resizer`, `api-recorder-resize-handler`)}></div>;
});

type p = {
  children: (args: { height: number }) => React.ReactNode;
}
const Resizer = ({ children, ...rest }: p) => {
  const { state, dispatch } = useStore();
  const innerHeight = Math.min(window.innerHeight);

  const height = Math.min(state.height || innerHeight / 2,(window.innerHeight -60));

  const onResize = throttle((e: any) => {
    /* resize 之前的值 */

    const ratio = Math.min(Math.max(e.clientY / innerHeight, 0.05), 0.92);
    const h = Math.floor(innerHeight * (1 - ratio));
    if (height != h) {
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
      maxConstraints={[Infinity, innerHeight]}
      handle={<ResizeHandle/>}
      onResize={onResize}
      {...rest}>
      {children?.({ height })}
    </Resizable>
  );
};

export default Resizer;
