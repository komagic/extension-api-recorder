import { throttle } from 'lodash';
import classnames from 'classnames';
import React, { useState } from 'react';
import { Resizable } from 'react-resizable';

const ResizeHandle = React.forwardRef(({ handleAxis, ...props }, ref) => {
  return <div ref={ref} {...props} className={classnames(`handle-${handleAxis}`, `api-recorder-resize-handler`)}></div>;
});

const Resizer = ({ children }) => {
  const clientHeight = document.body.clientHeight;

  const [height, setHeight] = useState(clientHeight / 2); // 初始高度
  const onResize = throttle((e: any, direction: any, ref: any, d: any) => {
    /* resize 之前的值 */
    window.requestAnimationFrame(() => {
      const ratio = Math.min(Math.max(e.clientY / clientHeight, 0.05), 0.92);
      console.log('onResize', ratio);

      setHeight(clientHeight * (1 - ratio));
    });
  });

  // 克隆子组件并传递额外的props

  return (
    <Resizable
      height={1000}
      width={Infinity}
      axis="y"
      minConstraints={[Infinity, 100]}
      maxConstraints={[Infinity, 600]}
      handle={<ResizeHandle />}
      onResize={onResize}>
      {children({ height: height })}
    </Resizable>
  );
};

export default Resizer;
