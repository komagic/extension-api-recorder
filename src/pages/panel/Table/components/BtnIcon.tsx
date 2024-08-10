import { Button, ButtonProps } from '@nextui-org/react';
import React from 'react';

function BtnIcon({ children, ...rest }: ButtonProps) {
  return (
    <Button className="p-0 min-w-10" size="sm" {...rest}>
      {children}
    </Button>
  );
}

export default BtnIcon;
