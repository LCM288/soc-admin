import {
  useRowState,
  useTable,
  UseRowStateInstanceProps,
  PluginHook,
  UseRowStateOptions,
  UseRowStateState,
  TableDispatch,
  UseTableRowProps,
  UseRowStateRowProps,
  UseTableCellProps,
  UseRowStateCellProps,
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
  CellValue,
} from "react-table";

import { ReactNode } from "react";

export interface SocSettingTableState<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseRowStateState<D> {
  hiddenColumns?: Array<IdType<D>>;
}

export interface SocSettingColumnInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<SocSettingColumnInterface<D>, "id">,
    SocSettingColumnInterfaceBasedOnValue<D>,
    UseSocSettingTableColumnProps<D> {}

export type UseCustomOptions = Partial<{
  dataUpdate: (rowIndex: number, diff: Record<string, unknown>) => void;
}>;

export interface SocSettingTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseSocSettingTableOptions<D>,
    UseRowStateOptions<D>,
    UseCustomOptions {}

export interface SocSettingTableInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> extends Omit<SocSettingTableOptions<D>, "columns" | "pageCount">,
    UseSocSettingTableInstanceProps<D>,
    UseRowStateInstanceProps<D> {}

export interface SocSettingRow<
  D extends Record<string, unknown> = Record<string, unknown>
> extends UseTableRowProps<D>,
    UseRowStateRowProps<D> {}

export interface SocSettingCell<
  D extends Record<string, unknown> = Record<string, unknown>,
  V = unknown
> extends UseTableCellProps<D, V>,
    UseRowStateCellProps<D> {}

const useSocSettingTable: SocSettingTableHook = (options) =>
  (useTable as (...args: unknown[]) => SocSettingTableInstance)(
    options,
    useRowState
  );

export default useSocSettingTable;

// the following should not be modified

export type SocSettingCellProps<
  D extends Record<string, unknown> = Record<string, unknown>,
  V = unknown
> = SocSettingTableInstance<D> & {
  column: SocSettingColumnInstance<D>;
  row: SocSettingRow<D>;
  cell: SocSettingCell<D, V>;
  value: CellValue<V>;
};

export type UpdateHiddenColumns<
  D extends Record<string, unknown> = Record<string, unknown>
> = (oldHidden: Array<IdType<D>>) => Array<IdType<D>>;

export type SocSettingHeaderGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableHeaderGroupProps, { column: SocSettingHeaderGroup<D> }>;

export type SocSettingFooterGroupPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableFooterGroupProps, { column: SocSettingHeaderGroup<D> }>;

export type SocSettingHeaderProps<
  D extends Record<string, unknown> = Record<string, unknown>
> = SocSettingTableInstance<D> & {
  column: SocSettingColumnInstance<D>;
};

export interface UseSocSettingTableColumnOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id?: IdType<D>;
  Header?: Renderer<SocSettingHeaderProps<D>>;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
}

export type SocSettingColumnInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> = UseSocSettingTableColumnOptions<D>;

export interface SocSettingColumnInterfaceBasedOnValue<
  D extends Record<string, unknown> = Record<string, unknown>,
  V = unknown
> {
  Cell?: Renderer<SocSettingCellProps<D, V>>;
}

export interface SocSettingColumnGroupInterface<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  columns: Array<SocSettingColumn<D>>;
}

export type SocSettingColumnGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> = SocSettingColumnInterface<D> &
  SocSettingColumnGroupInterface<D> &
  (
    | { Header: string }
    | ({ id: IdType<D> } & {
        Header: Renderer<SocSettingHeaderProps<D>>;
      })
  ) & { accessor?: Accessor<D> }; // Not used, but needed for backwards compatibility

export type ValueOf<T> = T[keyof T];

// The accessors like `foo.bar` are not supported, use functions instead
export type SocSettingColumnWithStrictAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = SocSettingColumnInterface<D> &
  ValueOf<
    {
      [K in keyof D]: {
        accessor: K;
      } & SocSettingColumnInterfaceBasedOnValue<D, D[K]>;
    }
  >;

export type SocSettingColumnWithLooseAccessor<
  D extends Record<string, unknown> = Record<string, unknown>
> = SocSettingColumnInterface<D> &
  SocSettingColumnInterfaceBasedOnValue<D> &
  (
    | { Header: string }
    | { id: IdType<D> }
    | { accessor: keyof D extends never ? IdType<D> : never }
  ) & {
    accessor?: keyof D extends never ? IdType<D> | Accessor<D> : Accessor<D>;
  };

export type SocSettingColumn<
  D extends Record<string, unknown> = Record<string, unknown>
> =
  | SocSettingColumnGroup<D>
  | SocSettingColumnWithLooseAccessor<D>
  | SocSettingColumnWithStrictAccessor<D>;

export interface SocSettingHeaderGroup<
  D extends Record<string, unknown> = Record<string, unknown>
> extends SocSettingColumnInstance<D>,
    UseSocSettingTableHeaderGroupProps<D> {}

export type SocSettingHeaderPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableHeaderProps, { column: SocSettingHeaderGroup<D> }>;

export type SocSettingFooterPropGetter<
  D extends Record<string, unknown> = Record<string, unknown>
> = PropGetter<D, TableFooterProps, { column: SocSettingHeaderGroup<D> }>;

export interface UseSocSettingTableColumnProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  id: IdType<D>;
  columns: Array<SocSettingColumnInstance<D>>;
  isVisible: boolean;
  render: (
    type: "Header" | "Footer" | string,
    props?: Record<string, unknown>
  ) => ReactNode;
  totalLeft: number;
  totalWidth: number;
  getHeaderProps: (
    propGetter?: SocSettingHeaderPropGetter<D>
  ) => TableHeaderProps;
  getFooterProps: (
    propGetter?: SocSettingFooterPropGetter<D>
  ) => TableFooterProps;
  toggleHidden: (value?: boolean) => void;
  parent: SocSettingColumnInstance<D>; // not documented
  getToggleHiddenProps: (userProps?: unknown) => unknown;
  depth: number; // not documented
  index: number; // not documented
  placeholderOf?: SocSettingColumnInstance;
}

export interface UseSocSettingTableHeaderGroupProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  headers: Array<SocSettingHeaderGroup<D>>;
  getHeaderGroupProps: (
    propGetter?: SocSettingHeaderGroupPropGetter<D>
  ) => TableHeaderProps;
  getFooterGroupProps: (
    propGetter?: SocSettingFooterGroupPropGetter<D>
  ) => TableFooterProps;
  totalHeaderCount: number; // not documented
}

export interface UseSocSettingTableInstanceProps<
  D extends Record<string, unknown> = Record<string, unknown>
> {
  state: SocSettingTableState<D>;
  plugins: Array<PluginHook<D>>;
  dispatch: TableDispatch;
  columns: Array<SocSettingColumnInstance<D>>;
  allColumns: Array<SocSettingColumnInstance<D>>;
  visibleColumns: Array<SocSettingColumnInstance<D>>;
  headerGroups: Array<SocSettingHeaderGroup<D>>;
  footerGroups: Array<SocSettingHeaderGroup<D>>;
  headers: Array<SocSettingColumnInstance<D>>;
  flatHeaders: Array<SocSettingColumnInstance<D>>;
  rows: Array<SocSettingRow<D>>;
  rowsById: Record<string, SocSettingRow<D>>;
  getTableProps: (propGetter?: TablePropGetter<D>) => TableProps;
  getTableBodyProps: (propGetter?: TableBodyPropGetter<D>) => TableBodyProps;
  prepareRow: (row: SocSettingRow<D>) => void;
  flatRows: Array<SocSettingRow<D>>;
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

export type UseSocSettingTableOptions<
  D extends Record<string, unknown> = Record<string, unknown>
> = {
  columns: Array<SocSettingColumn<D>>;
  data: D[];
} & Partial<{
  initialState: Partial<SocSettingTableState<D>>;
  stateReducer: (
    newState: SocSettingTableState<D>,
    action: ActionType,
    previousState: SocSettingTableState<D>,
    instance?: SocSettingTableInstance<D>
  ) => SocSettingTableState<D>;
  useControlledState: (
    state: SocSettingTableState<D>,
    meta: Meta<D>
  ) => SocSettingTableState<D>;
  defaultColumn: Partial<SocSettingColumn<D>>;
  getSubRows: (originalRow: D, relativeIndex: number) => D[];
  getRowId: (
    originalRow: D,
    relativeIndex: number,
    parent?: SocSettingRow<D>
  ) => string;
}>;

export type SocSettingTableHook<
  D extends Record<string, unknown> = Record<string, unknown>
> = (options: SocSettingTableOptions<D>) => SocSettingTableInstance;
