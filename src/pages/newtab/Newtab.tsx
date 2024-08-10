import '@pages/newtab/Newtab.css';
import '@pages/newtab/Newtab.scss';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import withSuspense from '@src/shared/hoc/withSuspense';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';

const Newtab = () => {
  const theme = useStorage(exampleThemeStorage);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
      }}></div>
  );
};

export default withErrorBoundary(withSuspense(Newtab, <div> Loading ... </div>), <div> Error Occur </div>);
