import {
  useTable,
  TableInstance,
  UseFiltersInstanceProps,
  UseGlobalFiltersInstanceProps,
  TableOptions,
  PluginHook,
  UseFiltersOptions,
  UseGlobalFiltersOptions,
  TableState,
  UseFiltersState,
  UseGlobalFiltersState,
} from "react-table";

type RegistrationsTableInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> = TableInstance<D> &
  UseGlobalFiltersInstanceProps<D> & {
    state: TableState<D> & UseGlobalFiltersState<D>;
  };

type RegistrationTableHook<
  D extends Record<string, unknown> = Record<string, unknown>
> = (
  options: TableOptions<D> & UseGlobalFiltersOptions<D>,
  ...plugins: Array<PluginHook<D>>
) => RegistrationsTableInstance;

/** Must be used with the useGlobalFilter plugin */
export const useRegistrationTable = useTable as RegistrationTableHook;

type MembersTableInstance<
  D extends Record<string, unknown> = Record<string, unknown>
> = TableInstance<D> &
  UseFiltersInstanceProps<D> &
  UseGlobalFiltersInstanceProps<D> & {
    state: TableState<D> & UseFiltersState<D> & UseGlobalFiltersState<D>;
  };

type MemberTableHook<
  D extends Record<string, unknown> = Record<string, unknown>
> = (
  options: TableOptions<D> &
    UseFiltersOptions<D> &
    UseGlobalFiltersOptions<D> & {
      initialState:
        | TableState<D>
        | UseFiltersState<D>
        | UseGlobalFiltersState<D>;
    },
  ...plugins: Array<PluginHook<D>>
) => MembersTableInstance;

/** Must be used with the useGlobalFilter plugin */
export const useMemberTable = useTable as MemberTableHook;
