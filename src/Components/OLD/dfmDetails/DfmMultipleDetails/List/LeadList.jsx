import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import { Description, EditRounded } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import { LEADS } from '../../../../config/pagesName';
import { GlobalHistory } from '../../../../helper';
import { TablePaginationActions } from '../../../../components/TableComponants/TablePaginationActions';

export const LeadDetailsList = (props) => (
  <>

    <div className="w-100 p-10P border-radius-10P bg-white list-view">
      <Table aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Property / Unit Number</TableCell>
            <TableCell align="center">Lead On</TableCell>
            <TableCell align="center">Rating</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Lead Stage</TableCell>
            <TableCell align="center">Completed</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="table-striped">
          {props.response && props.response.map((row, index) => (
            <TableRow hover key={index}>
              <TableCell component="th" scope="row">
                {row.lead.contact_name.name }
              </TableCell>
              <TableCell align="center">
                {' '}
                {`${row.lead.lead_type_id}` === '1' ? 'Owner' : 'Seeker' }
              </TableCell>
              <TableCell align="center">{row.lead.property_name ? row.lead.property_name.name : row.lead.property_name_unit_number ? row.lead.property_name_unit_number.name : 'N/A' }</TableCell>
              <TableCell align="center">{row.lead.lead_on ? row.lead.lead_on : 'N/A'}</TableCell>
              <TableCell align="center">{row.lead.rating}</TableCell>
              <TableCell align="center">{row.lead.status}</TableCell>
              <TableCell align="center">{row.lead.lead_stage}</TableCell>
              <TableCell align="center">{row.lead.data_completed}</TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="File"
                  className="mx-2"
                  size="small"
                  onClick={() => {
                                               props.onActionClick(row);
                                            }}
                >
                  <Description fontSize="inherit" />
                </IconButton>
              </TableCell>
            </TableRow>
                    ))}
        </TableBody>
      </Table>
    </div>
  </>
);
