import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import { Description, EditRounded, PriorityHighRounded } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { useTranslation } from 'react-i18next';
import { LEADS } from '../../../../config/pagesName';
import { GlobalHistory } from '../../../../Helper';

export const LeadList = (props) => {
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
                <TableCell align="left">{t('Leads.Name')}</TableCell>
                <TableCell align="center">{t('Leads.Type')}</TableCell>
                <TableCell align="center">{t('Leads.PropertyUnitNumber')}</TableCell>
                <TableCell align="center">{t('Leads.OperationType')}</TableCell>
                <TableCell align="center">{t('Leads.Required')}</TableCell>
                <TableCell align="center">{t('Leads.LeadOn')}</TableCell>
                <TableCell align="center">{t('Leads.Rating')}</TableCell>
                <TableCell align="center">{t('Leads.Status')}</TableCell>
                <TableCell align="center">{t('Leads.LeadStage')}</TableCell>
                <TableCell align="center">{t('Leads.Completed')}</TableCell>
                <TableCell align="center">{t('Leads.Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-striped">
              {props.response && props.response.leads && props.response.leads.map((row, index) => (
                <TableRow hover key={index}>
                  {enableMultiSelect && (
                  <TableCell component="th" scope="row">
                    <Checkbox
                      checked={checked.filter((i) => i.id === row.lead_type_id && i.type === row.lead_id).length > 0}
                      onChange={() => setSelectedIdsToMerge(row.lead_type_id, row.lead_id)}
                      value="primary"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </TableCell>
)}
                  <TableCell component="th" scope="row">
                    {row.contact_name }
                  </TableCell>
                  <TableCell align="center">
                    {' '}
                    {`${row.lead_type_id}` === '1' ? 'Owner' : 'Seeker' }
                  </TableCell>
                  <TableCell align="center">{row.property_name ? row.property_name : row.property_name_unit_number ? row.property_name_unit_number : 'N/A' }</TableCell>
                  <TableCell align="center">{row.operation_type}</TableCell>
                  <TableCell align="center">{row.propertyunit_type ? JSON.parse(row.propertyunit_type).join(',') : 'N/A'}</TableCell>
                  <TableCell align="center">{row.lead_on ? row.lead_on : 'N/A'}</TableCell>
                  <TableCell align="center">{row.rating}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">{row.lead_stage}</TableCell>
                  <TableCell align="center">{row.data_completed}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="Edit"
                      className="mx-2"
                      size="small"
                      onClick={() => {
                                                GlobalHistory.push(
                                                    `/main/edit/${LEADS}/${row.lead_type_id}/${row.lead_id}/all`
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
                                                    `/main/details/${LEADS}/${row.lead_type_id}/${row.lead_id}`
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
                                 `/main/edit/${LEADS}/${row.lead_type_id}/${row.lead_id}/missing`
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
