import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import React, { useState } from 'react';
import { useNetTable } from './useNetTable';

type BaseBtnProps = ButtonProps &
  TooltipProps & {
    children?: React.ReactNode;
    toolTip: string;
  };

const BaseBtn: React.FC<BaseBtnProps> = ({ children, disabled, toolTip = null, placement = 'top', ...rest }) => {
  const { state, dispatch } = useNetTable();
  const wrapper = toolTip ? (
    <Tooltip title={toolTip} placement={placement}>
      <Button size="small" {...rest} disabled={!state.enable || disabled}>
        {children}
      </Button>
    </Tooltip>
  ) : (
    <Button size="small" {...rest} disabled={!state.enable || disabled}>
      {children}
    </Button>
  );
  return wrapper;
};

export default BaseBtn;