import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogContent, Grid } from '@material-ui/core';
import { GetAllFormFieldsByFormId } from '../../../../../Services';
import { ConvertJsonToFormV2 } from '../../../FormBuilder/Utilities/ConvertJsonToForm';
import ConvertJson from '../../../FormBuilder/Utilities/FormRender/ConvertJson';

function ReportFormDialogBody({
  formId, setloadingDialog, onSaveReportDto, reportDto, ableContinueReport
}) {
  const [reportFeild, setReportFeild] = useState([]);
  const [errors, setErrors] = useState([]);
  const getFromFiled = useCallback(async () => {
    setloadingDialog(true);
    const res = await GetAllFormFieldsByFormId(formId);
    const items = ConvertJsonToFormV2(res);
    setReportFeild(items);
    setloadingDialog(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);
  useEffect(() => {
    getFromFiled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  useEffect(() => {
  }, [reportDto]);

  const setData = useCallback(
    (i, newValue) => {
      if (i === undefined || newValue === undefined) return;
      if (i === -1 || i === '') return;
      if (!reportFeild) return;
      onSaveReportDto((items) => {
        items[reportFeild[i].data.DtoName ? reportFeild[i].data.DtoName : reportFeild[i].field.id] = newValue;
        return { ...items };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reportFeild]
  );
  return (
    <DialogContent>
      <Grid
        container
        justify='center'
        alignItems='flex-start'
        className='stepperStip form-builder-items-wrapper'
      >
        {reportFeild && reportFeild.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className='form-builder-item-wrapper px-2'

            index={index}
          >
            <ConvertJson
              item={item}
              setData={setData}
              setError={setErrors}
              itemValue={reportDto[reportFeild[index].field.id]}
              index={index}
              values={reportDto}
              setDateReport={setData}
              itemList={reportFeild}
              selectedValues={reportDto}
              ableContinueReport={ableContinueReport}
            />
          </Grid>
        ))}

      </Grid>
    </DialogContent>
  );
}

export default ReportFormDialogBody;
ReportFormDialogBody.propTypes = {
  formId: PropTypes.number,
  setloadingDialog: PropTypes.func,
  onSaveReportDto: PropTypes.func,
  reportDto: PropTypes.object
};
