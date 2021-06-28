import React from "react";
import { useExpanded, useTable } from "react-table";

import makeData from "../makeData";

// This could be inlined into SubRowAsync, this this lets you reuse it across tables
function SubRows({ row, rowProps, visibleColumns, data, loading }: any) {
  if (loading) {
    return (
      <tr>
        <td />
        <td colSpan={visibleColumns.length - 1}>Loading...</td>
      </tr>
    );
  }

  // error handling here :)

  return (
    <>
      {data.map((x: any, i: number) => {
        return (
          <tr {...rowProps} key={`${rowProps.key}-expanded-${i}`}>
            {row.cells.map((cell: any) => {
              return (
                <td {...cell.getCellProps()}>
                  {cell.render(cell.column.SubCell ? "SubCell" : "Cell", {
                    value: cell.column.accessor && cell.column.accessor(x, i),
                    row: { ...row, original: x },
                  })}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

function SubRowAsync({ row, rowProps, visibleColumns }: any) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setData(makeData(3));
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      data={data}
      loading={loading}
    />
  );
}

// A simple way to support a renderRowSubComponent is to make a render prop
// This is NOT part of the React Table API, it's merely a rendering
// option we are creating for ourselves in our table renderer
function Table({ columns: userColumns, data, renderRowSubComponent }: any) {
  const tableProps = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded // We can useExpanded to track the expanded state
    // for sub components too!
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = tableProps;

  return (
    <>
      <pre>
        <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
      </pre>
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
              // Use a React.Fragment here so the table markup is still valid
              <React.Fragment key={rowProps.key}>
                <tr {...rowProps}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                {/* We could pass anything into this */}
                {row.isExpanded &&
                  renderRowSubComponent({ row, rowProps, visibleColumns })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }: any) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "👇" : "👉"}
          </span>
        ),
        // We can override the cell renderer with a SubCell to be used with an expanded row
        SubCell: () => null, // No expander on an expanded row
      },
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            // We re-map data using accessor functions for subRows
            accessor: (d: any) => d.firstName,
            // We can render something different for subRows
            SubCell: (cellProps: any) => <>🥳 {cellProps.value} 🎉</>,
          },
          {
            Header: "Last Name",
            accessor: (d: any) => d.lastName,
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: (d: any) => d.age,
          },
          {
            Header: "Visits",
            accessor: (d: any) => d.visits,
          },
          {
            Header: "Status",
            accessor: (d: any) => d.status,
          },
          {
            Header: "Profile Progress",
            accessor: (d: any) => d.progress,
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(10), []);

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRowAsync
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ),
    []
  );

  return (
    <Table
      columns={columns}
      data={data}
      // We added this as a prop for our table component
      // Remember, this is not part of the React Table API,
      // it's merely a rendering option we created for
      // ourselves
      renderRowSubComponent={renderRowSubComponent}
    />
  );
}

export default App;
