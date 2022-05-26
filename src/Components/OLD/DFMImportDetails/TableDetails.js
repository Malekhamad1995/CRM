import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TableFooter from '@material-ui/core/TableFooter';
import Toolbar from '@material-ui/core/Toolbar';
import TablePagination from '@material-ui/core/TablePagination';
import { CancelOutlined, CheckCircleOutlined } from '@material-ui/icons';
import {
  CONTACTS, LEADS, PROPERTIES, UNITS,
} from '../../../config/pagesName';

const TableDetails = ({
  items, currentPage, changePage, count,
}) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tableHeaders, setTableHeaders] = React.useState([]);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    changePage(1);
  };
  useEffect(() => {
    if (items[0].type.toLowerCase() === CONTACTS) {
      setTableHeaders(['First Name', 'Last Name', 'Mobile Number', 'Email', 'Class', 'Nationality']);
    } else if (items[0].type.toLowerCase() === PROPERTIES) {
      setTableHeaders(['Property Plan Id', 'Property Name', 'Property owner Id', 'Property Type Id', 'Country', 'City', 'Contact_Id']);
    } else if (items[0].type.toLowerCase() === UNITS) {
      setTableHeaders(['Unit Type Id', 'Property Id Number', 'Unit Number', 'Unit Model', 'Bedrooms', 'Bathrooms', 'Owner Id']);
    }
  }, []);
  return (
    <div className="w-100 p-10P m-10P border-radius-10P bg-white list-view">
      <Toolbar>
        <Typography style={{ flex: '1 1 100%' }} variant="h6" id="tableTitle">
          {items[0].reason ? 'Failed' : 'Success'}
        </Typography>
      </Toolbar>
      <Table aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Excel Row No</TableCell>
            {tableHeaders.map((name) => (<TableCell align="center">{name}</TableCell>))}
            <TableCell align="center">Status</TableCell>
            {items[0].reason && <TableCell align="center">Failure reason</TableCell>}

          </TableRow>
        </TableHead>
        <TableBody className="table-striped">
          {items.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell align="center">{row.file_row_number || 'N/A'}</TableCell>
              {items[0].type.toLowerCase() === CONTACTS
                            && (
                              <>
                                <TableCell align="center">{row.data.first_name || 'N/A'}</TableCell>
                                <TableCell align="center">{row.data.last_name || 'N/A'}</TableCell>
                                <TableCell align="center">{row.data.mobile && row.data.mobile.phone || 'N/A'}</TableCell>
                                <TableCell align="center">{row.data.email && row.data.email.email || 'N/A'}</TableCell>
                                <TableCell align="center">{row.data.company_class || 'N/A'}</TableCell>
                                <TableCell align="center">{row.data.nationality || 'N/A'}</TableCell>
                              </>
                            )}
              {items[0].type.toLowerCase() === PROPERTIES
              && (
                <>
                  <TableCell align="center">{row.data.property_plan || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.property_name || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.property_owner && row.data.property_owner.id || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.property_type_id || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.country || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.city || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.contact_name || 'N/A'}</TableCell>
                </>
              )}
              {items[0].type.toLowerCase() === UNITS
              && (
                <>
                  <TableCell align="center">{row.data.unit_type_id || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.property_name && row.data.property_name.id || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.unit_number || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.unit_model || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.bedrooms || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.bathrooms || 'N/A'}</TableCell>
                  <TableCell align="center">{row.data.owner && row.data.owner.id || 'N/A'}</TableCell>
                </>
              )}
              <TableCell align="center">
                {row.is_valid === 1 ? <CheckCircleOutlined style={{ color: 'green' }} />
                  : <CancelOutlined style={{ color: 'red' }} />}
              </TableCell>
              {items[0].reason && <TableCell align="center">{row.reason}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[100]}
              count={count}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              onChangePage={(e, newPage) => {
                changePage(newPage);
              }}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
export default TableDetails;
