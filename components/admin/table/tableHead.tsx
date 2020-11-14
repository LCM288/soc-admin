import React from "react";
import {
  RegistrationHeaderGroup,
  RegistrationColumnInstance,
} from "utils/useRegistrationTable";

interface Props {
  headerGroups: RegistrationHeaderGroup<Record<string, unknown>>[];
  getSortDirectionIndicatior: (column: RegistrationColumnInstance) => string;
}

const TableHead = ({
  headerGroups,
  getSortDirectionIndicatior,
}: Props): React.ReactElement => {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th
              {...column.getHeaderProps(column.getSortByToggleProps())}
              style={{
                width: column.width,
                maxWidth: column.maxWidth,
                minWidth: column.minWidth,
              }}
            >
              {column.render("Header")}
              <span>{getSortDirectionIndicatior(column)}</span>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHead;
