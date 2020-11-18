import {
  usePagination,
  useTable,
  UsePaginationInstanceProps,
  PluginHook,
  UsePaginationOptions,
  UsePaginationState,
  TableDispatch,
  Row,
  TablePropGetter,
  TableProps,
  TableBodyPropGetter,
  TableBodyProps,
  IdType,
  TableToggleHideAllColumnProps,
  Hooks,
  PropGetter,
  TableHeaderGroupProps,
  TableFooterGroupProps,
  TableHeaderProps,
  TableFooterProps,
  Meta,
  ActionType,
  Renderer,
  Accessor,
  CellProps,
} from "react-table";

import { ReactNode } from "react";

export interface LogTableState<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UsePaginationState<D> {
  hiddenColumns?: Array<IdType<D>>;
}

export interface LogColumnInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<LogColumnInterface<D>, "id">,
    LogColumnInterfaceBasedOnValue<D>,
    UseLogTableColumnProps<D> {}

export type UseCustomOptions = Partial<{
  dataUpdate: (rowIndex: number, diff: Record<string, unknown>) => void;
}>;

export interface LogTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseLogTableOptions<D>,
    UsePaginationOptions<D>,
    UseCustomOptions {}

export interface LogTableInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<LogTableOptions<D>, "columns" | "pageCount">,
    UseLogTableInstanceProps<D>,
    UsePaginationInstanceProps<D> {}

const useLogTable: LogTableHook = (options) =>
  (useTable as (...args: unknown[]) => LogTableInstance)(
    options,
    usePagination
  );

export default useLogTable;

// the following should not be modified

export type UpdateHiddenColumns<
  D extends Record<string, unknown> = Record<string, unknown>
> = (oldHidden: Array<IdType<D>>) => Array<IdType<D>>;

export type LogHeaderGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableHeaderGroupProps, { column: LogHeaderGroup<D> }>;

export type LogFooterGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableFooterGroupProps, { column: LogHeaderGroup<D> }>;

export type LogHeaderProps<
  D extends Record<string, unknown> = Record<string, unknown>
> = LogTableInstance<D> & {
  column: LogColumnInstance<D>;
};

export interface UseLogTableColumnOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id?: IdType<D>;
  Header?: Renderer<LogHeaderProps<D>>;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
}

export type LogColumnInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> = UseLogTableColumnOptions<D>;

export interface LogColumnInterfaceBasedOnValue<
  D extends Record<string, unknown> = Record<string, unknown>,
  V = unknown
> {
  Cell?: Renderer<CellProps<D, V>>;
}

export interface LogColumnGroupInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  columns: Array<LogColumn<D>>;
}

export type LogColumnGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> = LogColumnInterface<D> &
  LogColumnGroupInterface<D> &
  (
    | { Header: string }
    | ({ id: IdType<D> } & {
        Header: Renderer<LogHeaderProps<D>>;
      })
  ) & { accessor?: Accessor<D> }; // Not used, but needed for backwards compatibility

export type ValueOf<T> = T[keyof T];

// The accessors like `foo.bar` are not supported, use functions instead
export type LogColumnWithStrictAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = LogColumnInterface<D> &
  ValueOf<
    {
      [K in keyof D]: {
        accessor: K;
      } & LogColumnInterfaceBasedOnValue<D, D[K]>;
    }
  >;

export type LogColumnWithLooseAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = LogColumnInterface<D> &
  LogColumnInterfaceBasedOnValue<D> &
  (
    | { Header: string }
    | { id: IdType<D> }
    | { accessor: keyof D extends never ? IdType<D> : never }
  ) & {
    accessor?: keyof D extends never ? IdType<D> | Accessor<D> : Accessor<D>;
  };

export type LogColumn<
  D extends Record<string, unknown> = Record<string, unknown>
> =
  | LogColumnGroup<D>
  | LogColumnWithLooseAccessor<D>
  | LogColumnWithStrictAccessor<D>;

export interface LogHeaderGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> extends LogColumnInstance<D>,
    UseLogTableHeaderGroupProps<D> {}

export type LogHeaderPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableHeaderProps, { column: LogHeaderGroup<D> }>;

export type LogFooterPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableFooterProps, { column: LogHeaderGroup<D> }>;

export interface UseLogTableColumnProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id: IdType<D>;
  columns: Array<LogColumnInstance<D>>;
  isVisible: boolean;
  render: (
    type: "Header" | "Footer" | string,
    props?: Record<string, unknown>
  ) => ReactNode;
  totalLeft: number;
  totalWidth: number;
  getHeaderProps: (propGetter?: LogHeaderPropGetter<D>) => TableHeaderProps;
  getFooterProps: (propGetter?: LogFooterPropGetter<D>) => TableFooterProps;
  toggleHidden: (value?: boolean) => void;
  parent: LogColumnInstance<D>; // not documented
  getToggleHiddenProps: (userProps?: unknown) => unknown;
  depth: number; // not documented
  index: number; // not documented
  placeholderOf?: LogColumnInstance;
}

export interface UseLogTableHeaderGroupProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  headers: Array<LogHeaderGroup<D>>;
  getHeaderGroupProps: (
    propGetter?: LogHeaderGroupPropGetter<D>
  ) => TableHeaderProps;
  getFooterGroupProps: (
    propGetter?: LogFooterGroupPropGetter<D>
  ) => TableFooterProps;
  totalHeaderCount: number; // not documented
}

export interface UseLogTableInstanceProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  state: LogTableState<D>;
  plugins: Array<PluginHook<D>>;
  dispatch: TableDispatch;
  columns: Array<LogColumnInstance<D>>;
  allColumns: Array<LogColumnInstance<D>>;
  visibleColumns: Array<LogColumnInstance<D>>;
  headerGroups: Array<LogHeaderGroup<D>>;
  footerGroups: Array<LogHeaderGroup<D>>;
  headers: Array<LogColumnInstance<D>>;
  flatHeaders: Array<LogColumnInstance<D>>;
  rows: Array<Row<D>>;
  rowsById: Record<string, Row<D>>;
  getTableProps: (propGetter?: TablePropGetter<D>) => TableProps;
  getTableBodyProps: (propGetter?: TableBodyPropGetter<D>) => TableBodyProps;
  prepareRow: (row: Row<D>) => void;
  flatRows: Array<Row<D>>;
  totalColumnsWidth: number;
  allColumnsHidden: boolean;
  toggleHideColumn: (columnId: IdType<D>, value?: boolean) => void;
  setHiddenColumns: (param: Array<IdType<D>> | UpdateHiddenColumns<D>) => void;
  toggleHideAllColumns: (value?: boolean) => void;
  getToggleHideAllColumnsProps: (
    props?: Partial<TableToggleHideAllColumnProps>
  ) => TableToggleHideAllColumnProps;
  getHooks: () => Hooks<D>;
}

export type UseLogTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> = {
  columns: Array<LogColumn<D>>;
  data: D[];
} & Partial<{
  initialState: Partial<LogTableState<D>>;
  stateReducer: (
    newState: LogTableState<D>,
    action: ActionType,
    previousState: LogTableState<D>,
    instance?: LogTableInstance<D>
  ) => LogTableState<D>;
  useControlledState: (
    state: LogTableState<D>,
    meta: Meta<D>
  ) => LogTableState<D>;
  defaultColumn: Partial<LogColumn<D>>;
  getSubRows: (originalRow: D, relativeIndex: number) => D[];
  getRowId: (originalRow: D, relativeIndex: number, parent?: Row<D>) => string;
}>;

export type LogTableHook<
  D extends Record<string, unknown> = Record<string, unknown>
> = (options: LogTableOptions<D>) => LogTableInstance;
