import { Button, Popover } from 'antd';
import type { ButtonProps, TooltipProps } from 'antd'
import React from 'react';
import { useNetTable } from './useNetTable';
import { Z_INDEX_MAIN } from '@root/src/shared/constant';

type BaseBtnProps = ButtonProps &
  Partial<TooltipProps> & {
    children?: React.ReactNode;
    toolTip?: string | React.ReactNode;
  };

const BaseBtn: React.FC<BaseBtnProps> = ({
  children,
  onClick,
  disabled,
  toolTip = null,
  placement = 'top',
  ...rest
}) => {
  const { state } = useNetTable();
  const wrapper = toolTip ? (
    <Popover
      content={toolTip}
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
    </Popover>
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
