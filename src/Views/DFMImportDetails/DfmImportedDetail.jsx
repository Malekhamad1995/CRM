
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {
  FETCH_APPROVE_IMPORTED_FILE,
  FETCH_FILE_BY_PROCESS_ID_F,
  FETCH_FILE_BY_PROCESS_ID_S,
} from '../../store/file/Actions';
import TableDetails from '../../Components/DFMImportDetails/TableDetails';
import Alert from '../../Components/dfmAddEditAndDelete/Alert';
import { changeLoading, GlobalHistory } from '../../Helper';

const DFMImportedDetails = ({
  match: { params: { ProcessId } }, filesByProcessSuccessIDResponse,
  filesByProcessFailIDResponse, fetchFileByProcessIdSuccess, fetchFileByProcessIdFail,
  approveImportedFileResponse, fetchApproveImportedFile,
}) => {
  const [successPageNumber, setSuccessPageNumber] = useState(0);
  const [failPageNumber, setFailPageNumber] = useState(0);
  const [successRecords, setSuccessRecords] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [failRecords, setFailRecords] = useState([]);
  useEffect(() => {
    if (ProcessId) {
      changeLoading(true);
      setErrorMsg('');
      setSuccessPageNumber(0);
      setFailPageNumber(0);
      fetchFileByProcessIdSuccess({ ProcessId, pageNumber: 1 });
      fetchFileByProcessIdFail({ ProcessId, pageNumber: 1 });
    }
  }, [ProcessId]);

  useEffect(() => {
    if (approveImportedFileResponse) {
      changeLoading(false);
      if (approveImportedFileResponse.error && approveImportedFileResponse.error.message)
        setErrorMsg(approveImportedFileResponse.error.message);
       else GlobalHistory.push('/main');
    }
  }, [approveImportedFileResponse]);
  useEffect(() => {
    if (ProcessId) {
      changeLoading(true);
      setErrorMsg('');
      fetchFileByProcessIdSuccess({ ProcessId, pageNumber: successPageNumber + 1 });
    }
  }, [successPageNumber]);
  useEffect(() => {
    if (ProcessId) {
      changeLoading(true);
      setErrorMsg('');
      fetchFileByProcessIdFail({ ProcessId, pageNumber: failPageNumber + 1 });
    }
  }, [failPageNumber]);
  useEffect(() => {
    if (filesByProcessSuccessIDResponse) {
      if (filesByProcessSuccessIDResponse.BulkData) setSuccessRecords([...filesByProcessSuccessIDResponse.BulkData]);
      if (filesByProcessSuccessIDResponse.error && filesByProcessSuccessIDResponse.error.message)setErrorMsg(filesByProcessSuccessIDResponse.error.message);
      changeLoading(false);
    }
    if (filesByProcessFailIDResponse) {
      if (filesByProcessFailIDResponse.BulkData) setFailRecords([...filesByProcessFailIDResponse.BulkData]);
      if (filesByProcessFailIDResponse.error && filesByProcessFailIDResponse.error.message)setErrorMsg(filesByProcessFailIDResponse.error.message);
      changeLoading(false);
    }
  }, [filesByProcessFailIDResponse, filesByProcessSuccessIDResponse]);
  return (
    <div>
      {errorMsg !== ''
      && <Alert msg={errorMsg} />}
      <Card
        variant='outlined'
        style={{
          width: '100%', marginBottom: 20,
        }}
      >
        <CardContent style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <div>
              Contact Status:
              <span style={{ color: 'blue' }}>Pending</span>
              {' '}

            </div>
            <div>
              No. of success:
              <span style={{ color: 'green' }}>{filesByProcessSuccessIDResponse && filesByProcessSuccessIDResponse.validTotalCount}</span>
              {' '}

            </div>
            <div>
              {'No. of failed: '}
              <span style={{ color: 'red' }}>{filesByProcessFailIDResponse && filesByProcessFailIDResponse.inValidTotalCount}</span>
              {' '}

            </div>
          </div>
          <Button
            variant='contained'
            color='primary'
            style={{ height: 40 }}
            disabled={successRecords.length === 0}
            onClick={() => {
              changeLoading(true);
              fetchApproveImportedFile({ ProcessId });
            }}
          >
            {' '}
            Approve valid rows
          </Button>
        </CardContent>
      </Card>
      {successRecords && successRecords.length > 0
  && (
  <TableDetails
    items={successRecords}
    changePage={setSuccessPageNumber}
    currentPage={successPageNumber}
    count={filesByProcessSuccessIDResponse && filesByProcessSuccessIDResponse.validTotalCount}
  />
  )}
      <div style={{ height: 20 }} />
      { failRecords && failRecords.length > 0
      && (
      <TableDetails
        items={failRecords}
        changePage={setFailPageNumber}
        currentPage={failPageNumber}
        count={filesByProcessFailIDResponse && filesByProcessFailIDResponse.inValidTotalCount}
      />
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  const {
    files: {
      filesByProcessSuccessIDResponse,
      filesByProcessFailIDResponse,
      approveImportedFileResponse,
    },
  } = state;
  return {
    filesByProcessSuccessIDResponse,
    filesByProcessFailIDResponse,
    approveImportedFileResponse,
  };
};
function mapFuncToProps(dispatch) {
  return {
    dispatch,
    fetchFileByProcessIdSuccess: (payload) => dispatch(FETCH_FILE_BY_PROCESS_ID_S(payload)),
    fetchFileByProcessIdFail: (payload) => dispatch(FETCH_FILE_BY_PROCESS_ID_F(payload)),
    fetchApproveImportedFile: (payload) => dispatch(FETCH_APPROVE_IMPORTED_FILE(payload)),
  };
}
export default connect(mapStateToProps, mapFuncToProps)(DFMImportedDetails);
