import React from "react";
import { Column, TableInstance } from "react-table";

interface TableProps {
  columns: Array<Column<Record<string, any>>>;
  data: Array<Record<string, any>>;
  tableProps: TableInstance<any>;
  // useFilter: boolean;
  // usePaging: boolean;
  renderRowSubComponent?: (arg0: any) => JSX.Element;
}

const Table = ({
  columns,
  data,
  tableProps,
  renderRowSubComponent,
}: TableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = tableProps;

  console.log("visibleColumns", visibleColumns);
  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          const rowProps = row.getRowProps();
          return (
            <React.Fragment key={rowProps.key}>
              <tr {...rowProps}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
              {renderRowSubComponent &&
                row.isExpanded &&
                renderRowSubComponent({ row, rowProps, visibleColumns })}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
