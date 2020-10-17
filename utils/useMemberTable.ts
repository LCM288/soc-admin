import {
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
  useTable,
  UseFiltersInstanceProps,
  UseGlobalFiltersInstanceProps,
  UsePaginationInstanceProps,
  UseSortByInstanceProps,
  PluginHook,
  UseFiltersOptions,
  UseGlobalFiltersOptions,
  UsePaginationOptions,
  UseSortByOptions,
  UseFiltersState,
  UseGlobalFiltersState,
  UsePaginationState,
  UseSortByState,
  UseFiltersColumnProps,
  UseSortByColumnProps,
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

// region should not be modified start

export type UpdateHiddenColumns<
  D extends Record<string, unknown> = Record<string, unknown>
> = (oldHidden: Array<IdType<D>>) => Array<IdType<D>>;

export type MemberHeaderGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableHeaderGroupProps, { column: MemberHeaderGroup<D> }>;

export type MemberFooterGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableFooterGroupProps, { column: MemberHeaderGroup<D> }>;

export type MemberHeaderProps<
  D extends Record<string, unknown> = Record<string, unknown>
> = MemberTableInstance<D> & {
  column: MemberColumnInstance<D>;
};

export interface UseMemberTableColumnOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id?: IdType<D>;
  Header?: Renderer<MemberHeaderProps<D>>;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
}

export type MemberColumnInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> = UseMemberTableColumnOptions<D>;

export interface MemberColumnInterfaceBasedOnValue<
  D extends Record<string, unknown> = Record<string, unknown>,
  V = unknown
> {
  Cell?: Renderer<CellProps<D, V>>;
}

export interface MemberColumnGroupInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  columns: Array<MemberColumn<D>>;
}

export type MemberColumnGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> = MemberColumnInterface<D> &
  MemberColumnGroupInterface<D> &
  (
    | { Header: string }
    | ({ id: IdType<D> } & {
        Header: Renderer<MemberHeaderProps<D>>;
      })
  ) & { accessor?: Accessor<D> }; // Not used, but needed for backwards compatibility

export type ValueOf<T> = T[keyof T];

// The accessors like `foo.bar` are not supported, use functions instead
export type MemberColumnWithStrictAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = MemberColumnInterface<D> &
  ValueOf<
    {
      [K in keyof D]: {
        accessor: K;
      } & MemberColumnInterfaceBasedOnValue<D, D[K]>;
    }
  >;

export type MemberColumnWithLooseAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = MemberColumnInterface<D> &
  MemberColumnInterfaceBasedOnValue<D> &
  (
    | { Header: string }
    | { id: IdType<D> }
    | { accessor: keyof D extends never ? IdType<D> : never }
  ) & {
    accessor?: keyof D extends never ? IdType<D> | Accessor<D> : Accessor<D>;
  };

export type MemberColumn<
  D extends Record<string, unknown> = Record<string, unknown>
> =
  | MemberColumnGroup<D>
  | MemberColumnWithLooseAccessor<D>
  | MemberColumnWithStrictAccessor<D>;

export interface MemberHeaderGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> extends MemberColumnInstance<D>,
    UseMemberTableHeaderGroupProps<D> {}

export type MemberHeaderPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableHeaderProps, { column: MemberHeaderGroup<D> }>;

export type MemberFooterPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableFooterProps, { column: MemberHeaderGroup<D> }>;

export interface UseMemberTableColumnProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id: IdType<D>;
  columns: Array<MemberColumnInstance<D>>;
  isVisible: boolean;
  render: (
    type: "Header" | "Footer" | string,
    props?: Record<string, unknown>
  ) => ReactNode;
  totalLeft: number;
  totalWidth: number;
  getHeaderProps: (propGetter?: MemberHeaderPropGetter<D>) => TableHeaderProps;
  getFooterProps: (propGetter?: MemberFooterPropGetter<D>) => TableFooterProps;
  toggleHidden: (value?: boolean) => void;
  parent: MemberColumnInstance<D>; // not documented
  getToggleHiddenProps: (userProps?: unknown) => unknown;
  depth: number; // not documented
  index: number; // not documented
  placeholderOf?: MemberColumnInstance;
}

export interface UseMemberTableHeaderGroupProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  headers: Array<MemberHeaderGroup<D>>;
  getHeaderGroupProps: (
    propGetter?: MemberHeaderGroupPropGetter<D>
  ) => TableHeaderProps;
  getFooterGroupProps: (
    propGetter?: MemberFooterGroupPropGetter<D>
  ) => TableFooterProps;
  totalHeaderCount: number; // not documented
}

export interface UseMemberTableInstanceProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  state: MemberTableState<D>;
  plugins: Array<PluginHook<D>>;
  dispatch: TableDispatch;
  columns: Array<MemberColumnInstance<D>>;
  allColumns: Array<MemberColumnInstance<D>>;
  visibleColumns: Array<MemberColumnInstance<D>>;
  headerGroups: Array<MemberHeaderGroup<D>>;
  footerGroups: Array<MemberHeaderGroup<D>>;
  headers: Array<MemberColumnInstance<D>>;
  flatHeaders: Array<MemberColumnInstance<D>>;
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

export type UseMemberTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> = {
  columns: Array<MemberColumn<D>>;
  data: D[];
} & Partial<{
  initialState: Partial<MemberTableState<D>>;
  stateReducer: (
    newState: MemberTableState<D>,
    action: ActionType,
    previousState: MemberTableState<D>,
    instance?: MemberTableInstance<D>
  ) => MemberTableState<D>;
  useControlledState: (
    state: MemberTableState<D>,
    meta: Meta<D>
  ) => MemberTableState<D>;
  defaultColumn: Partial<MemberColumn<D>>;
  getSubRows: (originalRow: D, relativeIndex: number) => D[];
  getRowId: (originalRow: D, relativeIndex: number, parent?: Row<D>) => string;
}>;

export type MemberTableHook<
  D extends Record<string, unknown> = Record<string, unknown>
> = (options: MemberTableOptions<D>) => MemberTableInstance;

// region should not be modified end

export interface MemberTableState<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseFiltersState<D>,
    UseGlobalFiltersState<D>,
    UsePaginationState<D>,
    UseSortByState<D> {
  hiddenColumns?: Array<IdType<D>>;
}

export interface MemberColumnInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<MemberColumnInterface<D>, "id">,
    MemberColumnInterfaceBasedOnValue<D>,
    UseMemberTableColumnProps<D>,
    UseFiltersColumnProps<D>,
    UseSortByColumnProps<D> {}

export interface MemberTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseMemberTableOptions<D>,
    UseFiltersOptions<D>,
    UseGlobalFiltersOptions<D>,
    UsePaginationOptions<D>,
    UseSortByOptions<D> {}

export interface MemberTableInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<MemberTableOptions<D>, "columns" | "pageCount">,
    UseMemberTableInstanceProps<D>,
    UseFiltersInstanceProps<D>,
    UseGlobalFiltersInstanceProps<D>,
    UsePaginationInstanceProps<D>,
    UseSortByInstanceProps<D> {}

const useMemberTable: MemberTableHook = (options) =>
  (useTable as (...args: unknown[]) => MemberTableInstance)(
    options,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

export default useMemberTable;
