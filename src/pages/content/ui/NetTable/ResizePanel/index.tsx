import React, { useState } from 'react';
import { Children } from 'react/ts5.0';
import Resizer from '../Resizer';

const ResizablePanel: React.FC = ({ children }) => {
  const [width, setWidth] = useState<number>(300); // Initial width of the panel
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      setWidth(newWidth);
    }
  };

  // Add mousemove and mouseup listeners to the document for resizing
  React.useEffect(() => {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  return (
    <Resizer axis="x" className="flex-1">
      {() => children()}
    </Resizer>
  );
};

export default ResizablePanel;
