import React from "react";
// import EditTable from "./table/EditTable";
// import FilterTable from "./table/FilterTable";
// import SubComponentsTable from "./table/SubComponentsTable";
// import DefaultTable from "./table/DefaultTable";
// import SortTable from "./table/SortTable";
// import PaginationTable from "./table/PaginationTable";
import CustomColumnWidthTable from "./table/CustomColumnWidthTable";
import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const App = () => {
  return (
    <Styles>
      {/* <SubComponentsTable />
      <FilterTable />
      <EditTable />
      <DefaultTable /> */}
      {/* <SortTable /> */}
      {/* <PaginationTable /> */}
      <CustomColumnWidthTable />
    </Styles>
  );
};

export default App;
