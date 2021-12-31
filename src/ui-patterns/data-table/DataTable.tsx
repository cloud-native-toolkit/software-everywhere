import React from 'react';

import {DataTable as CarbonDataTable, TableContainer, Table, TableHead, TableHeader, TableRow, TableBody, TableCell, TableProps} from 'carbon-components-react'
import {DataTableHeader, DataTableRow} from 'carbon-components-react/lib/components/DataTable/DataTable';

export interface HeaderData<T> {
  key: keyof T;
  header: string;
}

export interface DataTableProps<T extends DataTableRow> {
  headers: HeaderData<T>[];
  data: T[];
  title?: string;
}

interface TableFunctionProps<T> {
  rows: TableRowData[];
  headers: DataTableHeader[];
  getHeaderProps: (header: {header: DataTableHeader}) => object;
  getTableProps: () => TableProps;
}

interface TableCellData {
  id: string;
  value: any;
}

interface TableRowData {
  id: string;
  cells: TableCellData[];
}

export class DataTable<T extends DataTableRow> extends React.Component<DataTableProps<T>, any> {

  get rowData(): T[] {
    return this.props.data;
  }

  get headerData(): DataTableHeader[] {
    return this.props.headers as any;
  }

  get title(): string {
    return this.props.title || '';
  }

  render() {
    return (
      <CarbonDataTable rows={this.rowData} headers={this.headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }: TableFunctionProps<T>) => (
          <TableContainer title={this.title}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header: DataTableHeader) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: TableRowData) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell: TableCellData) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CarbonDataTable>
    );
  }
}
