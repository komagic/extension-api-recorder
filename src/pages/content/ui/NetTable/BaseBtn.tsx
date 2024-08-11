import { Button, ButtonProps } from 'antd';
import React, { useState } from 'react';

interface BaseBtnProps extends ButtonProps {
  children?: React.ReactNode;
}

const BaseBtn: React.FC<BaseBtnProps> = ({ children, ...rest }) => {
  return (
    <Button size="small" {...rest}>
      {children}
    </Button>
  );
};

export default BaseBtn;
