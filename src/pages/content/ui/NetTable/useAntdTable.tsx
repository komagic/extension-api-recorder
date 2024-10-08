import React, { useState } from 'react';


function useAntdTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return [
    { selectedRowKeys },
    {
      rowSelection,
      rowKey: record => record.key,
    },
  ];
}

export default useAntdTable;
