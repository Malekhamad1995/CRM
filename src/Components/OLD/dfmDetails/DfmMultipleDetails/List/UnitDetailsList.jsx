import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import { DescriptionRounded, EditRounded } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import { UNITS } from '../../../../config/pagesName';
import { GlobalHistory } from '../../../../helper';
import { TablePaginationActions } from '../../../../components/TableComponants/TablePaginationActions';

export const UnitDetailsList = (props) => (
  <>

    <div className="w-100 p-10P  border-radius-10P bg-white list-view">
      <Table aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Property Name</TableCell>
            <TableCell align="center">Unit Type</TableCell>
            <TableCell align="center">Unit number</TableCell>
            <TableCell align="center">Service Type</TableCell>
            <TableCell align="center">Bedrooms#</TableCell>
            <TableCell align="center">Bathrooms#</TableCell>
            <TableCell align="center">Area in(sqft)</TableCell>
            <TableCell align="center">Completed</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="table-striped">

          {props.response && props.response && props.response.map((item, index) => {
                        const row = item.unit;
                        return (


                          <TableRow hover key={index}>
                            <TableCell component="th" scope="row">
                              {row.property_name.name}
                              {' '}
                            </TableCell>
                            <TableCell align="center">
                              {' '}
                              {row.unit_type }
                            </TableCell>
                            <TableCell align="center">{row.unit_number}</TableCell>
                            <TableCell align="center">{row.unit_type_id === '2' ? 'Rent' : 'Sale' }</TableCell>
                            <TableCell align="center">{row.bedrooms}</TableCell>
                            <TableCell align="center">{row.bathrooms}</TableCell>
                            <TableCell align="center">{row.size_sqft}</TableCell>
                            <TableCell align="center">{row.data_completed}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="File"
                                className="mx-2"
                                size="small"
                                onClick={() => {
                                             props.onActionClick(item);
                                            }}
                              >
                                <DescriptionRounded fontSize="inherit" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                    );
})}
        </TableBody>

      </Table>
    </div>
  </>
);
