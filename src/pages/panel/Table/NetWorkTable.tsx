import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Snippet,
} from '@nextui-org/react';
import { PlusIcon } from './PlusIcon';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
import { SearchIcon } from './SearchIcon';
import { users, statusOptions } from './data';
import { capitalize } from './utils';
import { NetworkEvent } from './type';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { useClipboard } from './useClipboard';
import TabsComponent from './components/TabsComponent';
import useModal from './Context/useModal';
import { StoreProvider, useStore } from './Context/useStore';
const columns = [
  { name: 'URL', uid: 'url', sortable: true },
  { name: '状态', uid: 'status', sortable: true },
  { name: '数据', uid: 'data', width: 300 },
  { name: '操作', uid: 'actions' },
];
// const statusColorMap: Record<string, ChipProps['color']> = {
//   active: 'success',
//   paused: 'danger',
//   vacation: 'warning',
// };

const INITIAL_VISIBLE_COLUMNS = columns.map(i => i.uid);

type User = (typeof users)[0];

const RenderCell = ({ item, columnKey, onOpen }) => {
  const { copy, copied } = useClipboard();

  switch (columnKey) {
    case 'url':
      return (
        <div className="flex gap-4 items-center">
          <span>{item.url}</span>
          <Button className="p-0 min-w-10" size="sm" onClick={() => copy(item.url)}>
            {copied ? <CheckOutlined /> : <CopyOutlined />}
          </Button>
        </div>
      );
    case 'status':
      return <div className="flex gap-4 items-center"></div>;

    case 'data':
      return (
        <div>
          <TabsComponent />
        </div>
      );
    default:
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon className="text-default-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>View</DropdownItem>
              <DropdownItem>Edit</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
  }
};

const NetWorkTable = () => {
  const [networkEvents, setNetworkEvents] = useState<NetworkEvent[]>([]);
  const { storeData } = useStore();
  const [filter_types, set_filter_types] = useState<string[]>(['xhr', 'fetch']);
  const clearEvents = useCallback(() => {
    setNetworkEvents([]);
  }, []);
  const displayData = networkEvents
    ?.filter(item => {
      return filter_types.includes(item?._resourceType);
    })
    .map((networkEvent: NetworkEvent, index) => {
      return {
        id: index,
        ...networkEvent,
        url: networkEvent?.request.url,
      };
    });

  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'age',
    direction: 'ascending',
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter(user => Array.from(statusFilter).includes(user.status));
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(displayData?.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const { ModalComponent, onOpen } = useStore();

  useEffect(() => {
    const handler = (message, sender, sendResponse) => {
      console.log('messagemessage', message);
      if (message.type === 'apirecorder_xhr_response') {
        const { path, response } = message.data;

        // 在 DevTools 中处理接收到的消息
        console.log(`Intercepted XHR at ${path}: ${response}`);
        // 你可以将数据展示在 DevTools 面板中，或做进一步的处理
      }
    };
    const handleMessage = event => {
      console.log('handleMessage', event);
      if (event.data.type === 'apirecorder_xhr_response') {
        console.log('event.data', event.data);
      }
    };
    window.addEventListener('message', handleMessage);
    chrome.runtime.onMessage.addListener(handler);
    // return () => {
    //   chrome.runtime.onMessage.removeListener(handler);
    // };
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div
        className="flex flex-col gap-4"
        style={{
          transform: 'translate3d(0,0,0)',
        }}>
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}>
                {statusOptions.map(status => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}>
                {columns.map(column => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, users.length, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <ModalComponent />
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} of ${displayData.length} selected`}
        </span>
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener((networkEvent: NetworkEvent) => {
      setNetworkEvents(networkEvents => [...networkEvents, networkEvent]);
    });

    chrome.devtools.network.onNavigated.addListener(() => {
      clearEvents();
    });
  }, [clearEvents]);

  return (
    <Table
      aria-label="Example table with custom cells"
      isHeaderSticky={true}
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      // classNames={{
      //   wrapper: 'max-h-[382px]',
      // }}
      disableAnimation
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onRowAction={key => {}}
      onCellAction={action => {}}
      disabledBehavior={'selection'}

      // onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No apis found'} items={displayData}>
        {item => (
          <TableRow
            key={item?.id}
            data-focus-visible={false}
            onClick={e => {
              e.stopPropagation();
            }}>
            {columnKey => (
              <TableCell data-selected={false}>
                <RenderCell item={item} onOpen={onOpen} columnKey={columnKey} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

// eslint-disable-next-line react/display-name
export default () => {
  return (
    <StoreProvider>
      <NetWorkTable />
    </StoreProvider>
  );
};
