import classnames from 'classnames';
import { throttle } from 'lodash';
import React from 'react';
import { Resizable } from 'react-resizable';
import { ACTIONS, useStore } from '../Context/useStore';

const ResizeHandle = React.forwardRef(({ handleAxis, ...props }, ref) => {
  return <div ref={ref} {...props} className={classnames(`handle-${handleAxis}`, `api-recorder-resize-handler`)}></div>;
});

const Resizer = ({ children }) => {
  const { state, dispatch } = useStore();
  const clientHeight = document.body.clientHeight;
  console.log('statestate', state);

  const height = state.height || clientHeight / 2;

  const onResize = throttle((e: any, direction: any, ref: any, d: any) => {
    /* resize 之前的值 */
    window.requestAnimationFrame(() => {
      const ratio = Math.min(Math.max(e.clientY / clientHeight, 0.05), 0.92);
      const h = clientHeight * (1 - ratio);

      dispatch({
        type: ACTIONS.UPDATE_STATE,
        payload: { height: h },
      });
    });
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
      onResize={onResize}>
      {children({ height })}
    </Resizable>
  );
};

export default Resizer;
