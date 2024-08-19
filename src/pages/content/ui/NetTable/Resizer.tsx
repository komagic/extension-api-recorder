import classnames from 'classnames';
import { throttle } from 'lodash';
import React from 'react';
import { Resizable } from 'react-resizable';
import { ACTIONS, useStore } from '../Context/useStore';

const ResizeHandle = React.forwardRef(({ handleAxis, ...props }, ref) => {
  return <div ref={ref} {...props} className={classnames(`handle-${handleAxis}`, `api-recorder-resize-handler`)}></div>;
});

const Resizer = ({ children, ...rest }: { children: (args: any) => any; [key in string]: any }) => {
  const { state, dispatch } = useStore();
  const innerHeight = Math.min(window.innerHeight);

  const height = state.height || innerHeight / 2;

  const onResize = throttle((e: any) => {
    /* resize 之前的值 */

    const ratio = Math.min(Math.max(e.clientY / innerHeight, 0.05), 0.92);
    const h = Math.floor(innerHeight * (1 - ratio));
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
      maxConstraints={[Infinity, innerHeight]}
      handle={<ResizeHandle />}
      onResize={onResize}
      {...rest}>
      {children({ height })}
    </Resizable>
  );
};

export default Resizer;
