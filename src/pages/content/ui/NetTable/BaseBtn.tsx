import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import React, { useState } from 'react';
import { useNetTable } from './useNetTable';
import { Z_INDEX_MAIN } from '@root/src/constant';

type BaseBtnProps = ButtonProps &
  TooltipProps & {
    children?: React.ReactNode;
    toolTip: string;
  };

const BaseBtn: React.FC<BaseBtnProps> = ({
  children,
  onClick,
  disabled,
  toolTip = null,
  placement = 'top',
  ...rest
}) => {
  const { state, dispatch } = useNetTable();
  const wrapper = toolTip ? (
    <Tooltip
      title={toolTip}
      style={{
        zIndex: Z_INDEX_MAIN + 1,
      }}
      placement={placement}>
      <Button
        size="small"
        {...rest}
        onClick={e => {
          e.stopPropagation();
          onClick(e);
        }}
        disabled={!state.enable || disabled}>
        {children}
      </Button>
    </Tooltip>
  ) : (
    <Button
      size="small"
      {...rest}
      onClick={e => {
        e.stopPropagation();
        onClick(e);
      }}
      disabled={!state.enable || disabled}>
      {children}
    </Button>
  );
  return wrapper;
};

export default BaseBtn;
