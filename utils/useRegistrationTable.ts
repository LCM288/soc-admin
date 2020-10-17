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

export type RegistrationHeaderGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<
  D,
  TableHeaderGroupProps,
  { column: RegistrationHeaderGroup<D> }
>;

export type RegistrationFooterGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<
  D,
  TableFooterGroupProps,
  { column: RegistrationHeaderGroup<D> }
>;

export type RegistrationHeaderProps<
  D extends Record<string, unknown> = Record<string, unknown>
> = RegistrationTableInstance<D> & {
  column: RegistrationColumnInstance<D>;
};

export interface UseRegistrationTableColumnOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id?: IdType<D>;
  Header?: Renderer<RegistrationHeaderProps<D>>;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
}

export type RegistrationColumnInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> = UseRegistrationTableColumnOptions<D>;

export interface RegistrationColumnInterfaceBasedOnValue<
  D extends Record<string, unknown> = Record<string, unknown>,
  V = unknown
> {
  Cell?: Renderer<CellProps<D, V>>;
}

export interface RegistrationColumnGroupInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  columns: Array<RegistrationColumn<D>>;
}

export type RegistrationColumnGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> = RegistrationColumnInterface<D> &
  RegistrationColumnGroupInterface<D> &
  (
    | { Header: string }
    | ({ id: IdType<D> } & {
        Header: Renderer<RegistrationHeaderProps<D>>;
      })
  ) & { accessor?: Accessor<D> }; // Not used, but needed for backwards compatibility

export type ValueOf<T> = T[keyof T];

// The accessors like `foo.bar` are not supported, use functions instead
export type RegistrationColumnWithStrictAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = RegistrationColumnInterface<D> &
  ValueOf<
    {
      [K in keyof D]: {
        accessor: K;
      } & RegistrationColumnInterfaceBasedOnValue<D, D[K]>;
    }
  >;

export type RegistrationColumnWithLooseAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = RegistrationColumnInterface<D> &
  RegistrationColumnInterfaceBasedOnValue<D> &
  (
    | { Header: string }
    | { id: IdType<D> }
    | { accessor: keyof D extends never ? IdType<D> : never }
  ) & {
    accessor?: keyof D extends never ? IdType<D> | Accessor<D> : Accessor<D>;
  };

export type RegistrationColumn<
  D extends Record<string, unknown> = Record<string, unknown>
> =
  | RegistrationColumnGroup<D>
  | RegistrationColumnWithLooseAccessor<D>
  | RegistrationColumnWithStrictAccessor<D>;

export interface RegistrationHeaderGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> extends RegistrationColumnInstance<D>,
    UseRegistrationTableHeaderGroupProps<D> {}

export type RegistrationHeaderPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableHeaderProps, { column: RegistrationHeaderGroup<D> }>;

export type RegistrationFooterPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableFooterProps, { column: RegistrationHeaderGroup<D> }>;

export interface UseRegistrationTableColumnProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id: IdType<D>;
  columns: Array<RegistrationColumnInstance<D>>;
  isVisible: boolean;
  render: (
    type: "Header" | "Footer" | string,
    props?: Record<string, unknown>
  ) => ReactNode;
  totalLeft: number;
  totalWidth: number;
  getHeaderProps: (
    propGetter?: RegistrationHeaderPropGetter<D>
  ) => TableHeaderProps;
  getFooterProps: (
    propGetter?: RegistrationFooterPropGetter<D>
  ) => TableFooterProps;
  toggleHidden: (value?: boolean) => void;
  parent: RegistrationColumnInstance<D>; // not documented
  getToggleHiddenProps: (userProps?: unknown) => unknown;
  depth: number; // not documented
  index: number; // not documented
  placeholderOf?: RegistrationColumnInstance;
}

export interface UseRegistrationTableHeaderGroupProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  headers: Array<RegistrationHeaderGroup<D>>;
  getHeaderGroupProps: (
    propGetter?: RegistrationHeaderGroupPropGetter<D>
  ) => TableHeaderProps;
  getFooterGroupProps: (
    propGetter?: RegistrationFooterGroupPropGetter<D>
  ) => TableFooterProps;
  totalHeaderCount: number; // not documented
}

export interface UseRegistrationTableInstanceProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  state: RegistrationTableState<D>;
  plugins: Array<PluginHook<D>>;
  dispatch: TableDispatch;
  columns: Array<RegistrationColumnInstance<D>>;
  allColumns: Array<RegistrationColumnInstance<D>>;
  visibleColumns: Array<RegistrationColumnInstance<D>>;
  headerGroups: Array<RegistrationHeaderGroup<D>>;
  footerGroups: Array<RegistrationHeaderGroup<D>>;
  headers: Array<RegistrationColumnInstance<D>>;
  flatHeaders: Array<RegistrationColumnInstance<D>>;
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

export type UseRegistrationTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> = {
  columns: Array<RegistrationColumn<D>>;
  data: D[];
} & Partial<{
  initialState: Partial<RegistrationTableState<D>>;
  stateReducer: (
    newState: RegistrationTableState<D>,
    action: ActionType,
    previousState: RegistrationTableState<D>,
    instance?: RegistrationTableInstance<D>
  ) => RegistrationTableState<D>;
  useControlledState: (
    state: RegistrationTableState<D>,
    meta: Meta<D>
  ) => RegistrationTableState<D>;
  defaultColumn: Partial<RegistrationColumn<D>>;
  getSubRows: (originalRow: D, relativeIndex: number) => D[];
  getRowId: (originalRow: D, relativeIndex: number, parent?: Row<D>) => string;
}>;

export type RegistrationTableHook<
  D extends Record<string, unknown> = Record<string, unknown>
> = (options: RegistrationTableOptions<D>) => RegistrationTableInstance;

// region should not be modified end

export interface RegistrationTableState<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseFiltersState<D>,
    UseGlobalFiltersState<D>,
    UsePaginationState<D>,
    UseSortByState<D> {
  hiddenColumns?: Array<IdType<D>>;
}

export interface RegistrationColumnInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<RegistrationColumnInterface<D>, "id">,
    RegistrationColumnInterfaceBasedOnValue<D>,
    UseRegistrationTableColumnProps<D>,
    UseFiltersColumnProps<D>,
    UseSortByColumnProps<D> {}

export interface RegistrationTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseRegistrationTableOptions<D>,
    UseFiltersOptions<D>,
    UseGlobalFiltersOptions<D>,
    UsePaginationOptions<D>,
    UseSortByOptions<D> {}

export interface RegistrationTableInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<RegistrationTableOptions<D>, "columns" | "pageCount">,
    UseRegistrationTableInstanceProps<D>,
    UseFiltersInstanceProps<D>,
    UseGlobalFiltersInstanceProps<D>,
    UsePaginationInstanceProps<D>,
    UseSortByInstanceProps<D> {}

const useRegistrationTable: RegistrationTableHook = (options) =>
  (useTable as (...args: unknown[]) => RegistrationTableInstance)(
    options,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

export default useRegistrationTable;
