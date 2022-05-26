import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { Tables } from '../../../../Components';

export const AgentsTabel = ({
  parentTranslationPath, translationPath, Data, Deletedfile
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const [filter] = useState({
    pageIndex: 0,
    pageSize: 1000,
  });
  const [response, setresponse] = useState([]);

  const tableActionClicked = useCallback((item) => {
    Deletedfile(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setresponse((Data && Data) || []);
  }, [Data]);
  return (
    <div className='ActivitiesType-View childs-wrapper'>
      <div className='filter-section-item' />
      <div className='w-100 px-2  Tables-AgentsTabelDialogView'>
        <Tables
          data={response}
          headerData={[
            {
              id: 1,
              label: t(`${translationPath}Date-range`),
              component: (item) => (
                <>
                  {(item &&
                    item.fromDate &&
                    item.fromDate &&
                    moment(item.fromDate).format('YYYY-MM-DD')) ||
                    ''}
                  {' '}
                  {item && item.fromDate && item.fromDate && '/'}
                  {' '}
                  {(item &&
                    item.toDate &&
                    item.toDate &&
                    moment(item.toDate).format('YYYY-MM-DD')) ||
                    ''}
                </>
              ),
            },
            {
              id: 2,
              label: t(`${translationPath}Time-range`),
              component: (item) => (
                <>
                  {(item && item.fromTime && item.fromTime) || ''}
                  {' '}
                  /
                  {' '}
                  {(item && item.toTime && item.toTime) || ''}
                </>
              ),
            },
            // {
            //   id: 3,
            //   label: t(`${translationPath}Media-name`),
            //   component: (item) => (
            //     <>
            //       {(item && item.mediaName && item.mediaName && item.mediaName.lookupItemName) ||
            //         'N/A'}
            //     </>
            //   ),
            // },
            // {
            //   id: 4,
            //   label: t(`${translationPath}Media-type`),
            //   component: (item) => (
            //     <>
            //       {(item &&
            //         item.mediaDetails &&
            //         item.mediaDetails &&
            //         item.mediaDetails.lookupItemName) ||
            //         'N/A'}
            //     </>
            //   ),
            // },
            {
              id: 4,
              label: t(`${translationPath}Action`),
              component: (item) => (
                <>
                  <Button
                    onClick={() => {
                      tableActionClicked(item);
                    }}
                    className='MuiButtonBase-root MuiButton-root MuiButton-text table-action-btn btns-icon theme-solid bg-danger'
                    type='button'
                  >
                    <span className='MuiButton-label'>
                      <span className='table-action-icon mdi mdi-trash-can' />
                    </span>
                    <span className='MuiTouchRipple-root' />
                  </Button>
                </>
              ),
            },
          ]}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={(response && response.length) || 0}
          defaultActions={[]}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
        />
      </div>
    </div>
  );
};
AgentsTabel.propTypes = {
  Data: PropTypes.instanceOf(Object).isRequired,
  Deletedfile: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
