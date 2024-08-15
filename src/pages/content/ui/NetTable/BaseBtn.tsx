import { Button, ButtonProps, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useNetTable } from './useNetTable';

interface BaseBtnProps extends ButtonProps {
  children?: React.ReactNode;
}

const BaseBtn: React.FC<BaseBtnProps> = ({ children, disabled, toolTip = null, ...rest }) => {
  const { state, dispatch } = useNetTable();
  const wrapper = toolTip ? (
    <Tooltip title={toolTip}>
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
