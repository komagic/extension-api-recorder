import { Button, ButtonProps } from 'antd';
import React, { useState } from 'react';
import { useNetTable } from './useNetTable';

interface BaseBtnProps extends ButtonProps {
  children?: React.ReactNode;
}

const BaseBtn: React.FC<BaseBtnProps> = ({ children, disabled, ...rest }) => {
  const { state, dispatch } = useNetTable();
  return (
    <Button size="small" {...rest} disabled={!state.enable || disabled}>
      {children}
    </Button>
  );
};

export default BaseBtn;
