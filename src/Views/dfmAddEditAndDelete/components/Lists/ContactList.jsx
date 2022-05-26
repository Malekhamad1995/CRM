import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import { Description, EditRounded, PriorityHighRounded } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { CONTACTS } from '../../../../config/pagesName';
import { GlobalHistory } from '../../../../Helper';

export const ContactList = (props) => {
    const { t } = useTranslation('DataFiles');
    const { enableMultiSelect, setSelectedIdsToMerge, checked } = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        props.changeLoading(true);
        props.Action(rowsPerPage, newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        props.changeLoading(true);
        props.Action(parseInt(event.target.value, 10), 1);
    };
    return (
      <>

        <div className="w-100 p-10P m-10P border-radius-10P bg-white list-view">
          <Table aria-label="caption table">
            <TableHead>
              <TableRow>
                {enableMultiSelect && <TableCell align="left" />}
                <TableCell align="left">{t('Contacts.Name')}</TableCell>
                <TableCell align="center">{t('Contacts.Type')}</TableCell>
                <TableCell align="center">{t('Contacts.Email')}</TableCell>
                <TableCell align="center">{t('Contacts.Class')}</TableCell>
                <TableCell align="center">{t('Contacts.Creation')}</TableCell>
                <TableCell align="center">{t('Contacts.Completed')}</TableCell>
                <TableCell align="center">{t('Contacts.Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-striped">
              {props.response && props.response.contacts && props.response.contacts.map((row, index) => (
                <TableRow hover key={index}>
                  {enableMultiSelect && (
                  <TableCell component="th" scope="row">
                    <Checkbox
                      checked={checked.filter((i) => i.id === row.contact_id && i.type === row.contact_type_id).length > 0}
                      onChange={() => setSelectedIdsToMerge(row.contact_type_id, row.contact_id)}
                      value="primary"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </TableCell>
)}
                  <TableCell component="th" scope="row">
                    {row.contact_type_id === '1' ? `${row.first_name} ${row.last_name}` : row.company_name }
                  </TableCell>
                  <TableCell align="center">
                    {' '}
                    {row.contact_type_id === '1' ? 'Individual' : 'Corporate' }
                  </TableCell>
                  <TableCell align="center">{ row.general_email && JSON.parse(row.general_email) && JSON.parse(row.general_email).email ? JSON.parse(row.general_email).email : row.general_email}</TableCell>
                  <TableCell align="center">{row.contact_class}</TableCell>
                  <TableCell align="center">{moment(row.created_date).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="center">{row.data_completed}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="Edit"
                      className="mx-2"
                      size="small"
                      onClick={() => {
                                                GlobalHistory.push(
                                                    `/main/edit/${CONTACTS}/${row.contact_type_id}/${row.contact_id}/all`
                                                );
                                            }}
                    >
                      <EditRounded fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      aria-label="File"
                      className="mx-2"
                      size="small"
                      onClick={() => {
                                                GlobalHistory.push(
                                                    `/main/details/${CONTACTS}/${row.contact_type_id}/${row.contact_id}`

                                                );
                                            }}
                    >
                      <Description fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      aria-label="Missing"
                      className="mx-2"
                      size="small"
                      onClick={() => {
                                                GlobalHistory.push(
                                                    `/main/edit/${CONTACTS}/${row.contact_type_id}/${row.contact_id}/missing`
                                                );
                                            }}
                    >
                      <PriorityHighRounded fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                    ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30, 40, 50]}
                  count={props.response.totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </>
);
};
