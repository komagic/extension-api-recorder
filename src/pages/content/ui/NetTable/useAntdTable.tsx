import { GetProp, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult, TableRowSelection } from 'antd/es/table/interface';
import React, { useState } from 'react';
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

function useAntdTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  return [
    { selectedRowKeys },
    {
      tableParams,
      rowSelection,
      pagination: tableParams.pagination,
      rowKey: record => record.key,
    },
  ];
}

export default useAntdTable;
