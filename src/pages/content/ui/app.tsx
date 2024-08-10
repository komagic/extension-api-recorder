import { useEffect } from 'react';
import NetWorkTable from './Table/NetWorkTable';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';

export default function App() {
  useEffect(() => {
    console.log('content view loaded');
  }, []);

  return <div> </div>;
}
