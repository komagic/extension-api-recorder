'use client';
import React from 'react';
import '@pages/popup/Popup.css';
// import useStorage from '@src/shared/hooks/useStorage';
// import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
const Popup = () => {
  // const theme = useStorage(exampleThemeStorage);

  return (
    <div className="dark text-foreground bg-background h-screen">
      {/* <button
          style={{
            backgroundColor: theme === 'light' ? '#fff' : '#000',
            color:'var(--primary-color)'
          }}
          onClick={exampleThemeStorage.toggle}>
          Toggle theme
        </button> */}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
