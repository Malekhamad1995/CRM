import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Tables, SwitchComponent } from '../../../../Components';
import { ActivityDetailsDialog } from '../ActivityDetailsDialog/ActivityDetailsDialog';

export const ActivityHistoryTable = ({
  parentTranslationPath,
  translationPath,
  data,

}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { t } = useTranslation([parentTranslationPath, 'Shared']);

  const [filter] = useState({
    pageIndex: 0,
    pageSize: 99999,
  });
  return (
    <div className=' activity-history w-100 px-2'>
      <Tables
        data={(data) || []}
        headerData={[

          {
            id: 1,
            label: 'activityId',
            input: 'activityId',
          },
          {
            id: 2,
            label: 'date',
            input: 'activityDate',
            isDate: true,
          },
          {
            id: 3,
            label: 'activity-type',
            input: 'activityTypeName',
          },
          {
            id: 4,
            label: 'category',
            input: 'categoryName',
          },

          {
            id: 5,
            label: 'agentName',
            input: 'agentName',
          },
          {
            id: 6,
            label: 'comments',
            input: 'comments',
          },
          {
            id: 7,
            label: 'status',
            input: 'isOpen',
            cellClasses: 'py-0',
            component: (item, index) => (
              <SwitchComponent
                idRef={`isOpenStatusRef${index + 1}`}
                isChecked={item.isOpen}
                labelClasses='px-0'
                themeClass='theme-line'
                labelValue={(item.isOpen && 'open') || 'closed'}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            ),
          },
          {
            id: 4,
            label: t(`${translationPath}Details`),
            component: (item) => (
              <>
                <Button
                  onClick={() => {
                    setOpenDetailsDialog(true);
                    setActiveItem(item);
                  }}
                  className='MuiButtonBase-root MuiButton-root MuiButton-text table-action-btn btns-icon theme-solid bg-green'
                  type='button'
                >
                  <span className='MuiButton-label'>
                    <span className='table-action-icon mdi mdi-eye-outline' />
                  </span>
                  <span className='MuiTouchRipple-root' />
                </Button>
              </>
            ),
          },

        ]}
        defaultActions={[
        ]}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={(data && data.length)}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
      />
      {openDetailsDialog && (
        <ActivityDetailsDialog
          open={openDetailsDialog}
          close={() => {
            setOpenDetailsDialog(false);
            setActiveItem(null);
          }}
          activeItem={activeItem}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

ActivityHistoryTable.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
};
