import React, { useCallback, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, Grid,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { Description } from '@material-ui/icons';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';
import { ImportFile, uploadFile } from '../../../Services/File';
import {
  CONTACTS, LEADS, PROPERTIES, UNITS,
} from '../../../config/pagesName';
import { showSuccess } from '../../../Helper';

const ImportDfmDialog = ({
  dfmPage, open, setOpen,
}) => {
  const { t } = useTranslation('DataFiles');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [type, setType] = useState(1);
  const [disableImport, setDisableImport] = useState(true);
  const [importState, setImportState] = useState({});
  const upload = async (file) => {
    setDisableImport(true);
    const form = new FormData();
    form.append('file', file);
    const result = await uploadFile(form);
    setDisableImport(false);
    if (dfmPage === CONTACTS) {
      setImportState({
        fileId: result.uuid,
        importProcceseType: type,
      });
    } else if (dfmPage === LEADS) {
      setImportState({
        fileId: result.uuid,
        importProcceseType: 2,
      });
    } else if (dfmPage === PROPERTIES) {
      setImportState({
        fileId: result.uuid,
        importProcceseType: 3,
      });
    } else if (dfmPage === UNITS) {
      setImportState({
        fileId: result.uuid,
        importProcceseType: 4,
      });
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFileName(acceptedFiles[0].name);
    upload(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Dialog onClose={() => setOpen(false)} open={open} className='importDfmDialog'>
      <DialogContent
        {...getRootProps()}
        onClick={(e) => e.preventDefault()}
      >
        <Grid container alignItems='center' justify='center' spacing={5}>
          <Grid item xs={12} md={4}>
            <div className='imageAndFileContainer'>
              <Description className='image' />
              <p align='center'>{selectedFileName || 'no file selected yet'}</p>
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className='header'>
                  Drag and drop or choose your excel file to add new &nbsp;
                  {dfmPage}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className='header'>
                  {' '}
                  Download a sample from &nbsp;
                  <a>here</a>
                </div>
              </Grid>
              {/*   <Grid item xs={12}> */}
              {/*       <div> */}
              {/*           <RadioGroup aria-label="type" name="type" value={type} */}
              {/*                       onChange={(e)=> setType(e.target.value)}> */}
              {/*               <FormControlLabel value="0" control={<Radio />} label="Individual" /> */}
              {/*               <FormControlLabel value="1" control={<Radio />} label="Corporate" /> */}
              {/*           </RadioGroup> */}
              {/*       </div> */}
              {/*   </Grid> */}
              <Grid item xs={12}>
                <div
                  {...getRootProps()}
                  className='buttonContainer'
                >
                  <input
                    {...getInputProps()}
                    accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                    type='file'
                    color='primary'
                    id='button-file'
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      setSelectedFileName(e.target.files[0].name);
                      upload(e.target.files[0]);
                    }}
                  />
                  <label htmlFor='button-file'>
                    <Button variant='contained' color='secondary'>
                      { isDragActive ? 'Drop Here' : 'Choose File'}
                    </Button>
                  </label>
                </div>
              </Grid>
              { dfmPage === CONTACTS && (
              <Grid item xs={12}>
                <div>
                  <RadioGroup
                    aria-label='type'
                    name='type'
                    value={type}
                    onChange={(e) => setType(parseInt(e.target.value))}
                  >
                    <FormControlLabel value={1} control={<Radio />} label='Individual' />
                    <FormControlLabel value={5} control={<Radio />} label='Corporate' />
                  </RadioGroup>
                </div>
              </Grid>
)}
              <Grid item xs={12}>
                {/* 12    <div */}
                {/*      className="header" */}
                {/*      style={{ */}
                {/*        color: 'grey',fontSize:15 */}
                {/*      }} */}
                {/*    >Max  8 MB per file */}
                {/*    </div> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          disabled={disableImport}
          onClick={() => {
            ImportFile(importState);
              setSelectedFileName('');
              setDisableImport(true);
              setImportState({});
            setOpen(false);
            showSuccess(t('Import.Notific_Importfile'));
          }}
          color='primary'
        >
          import
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ImportDfmDialog;
