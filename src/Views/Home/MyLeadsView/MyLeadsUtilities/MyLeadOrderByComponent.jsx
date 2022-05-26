import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { SelectComponet } from '../../../../Components';
import { GlobalOrderFilterActions } from '../../../../store/GlobalOrderFilter/GlobalOrderFilterActions';

const parentTranslationPath = 'MyLeadView';
const translationPath = '';
export const MyLeadOrderByComponent = ({
  orderBy,
  setOrderBy,
  orderFilter,
  selectedOrderBy,
  setSelectedOrderBy,
}) => {
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();

  const filterByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, filterBy: value }));
  };
  const orderByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, orderBy: value }));
  };
  const orderBySubmitted = (event) => {
    event.preventDefault();
    if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy) {
      if (orderBy.filterBy || orderBy.orderBy) setOrderBy({});
      return;
    }
    if (pathName.includes('my-lead')) {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          MyLeadFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    }
    if (pathName.includes('my-referrals')) {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          MyReferralsFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    }
    if (pathName.includes('sales-availability')) {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          SalesAvailabilityFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    }
    if (pathName.includes('leasing-availability')) {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          LeaseingAvailabilityFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    }
    setOrderBy({
      filterBy: selectedOrderBy.filterBy,
      orderBy: selectedOrderBy.orderBy,
    });
  };
  return (
    <div className='d-flex px-2 order-by-filter'>
      <span className='px-2 d-flex'>
        <span className='texts-large mt-1'>
          {t(`${translationPath}order-by`)}
          :
        </span>
        <div className='px-2'>
          <SelectComponet
            idRef='filterByRef'
            data={[
              { id: 'createdOn', filterBy: 'created-on' },
              { id: 'updateOn', filterBy: 'last-updated' },
            ]}
            value={selectedOrderBy.filterBy}
            onSelectChanged={filterByChanged}
            wrapperClasses='mb-3'
            isRequired
            valueInput='id'
            textInput='filterBy'
            emptyItem={{
              value: null,
              text: 'select-filter-by',
              isDisabled: false,
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
          />
        </div>
        <div className='px-2'>
          <SelectComponet
            idRef='orderByRef'
            data={[
              { id: 1, orderBy: 'ascending' },
              { id: 2, orderBy: 'descending' },
            ]}
            value={selectedOrderBy.orderBy}
            onSelectChanged={orderByChanged}
            wrapperClasses='mb-3'
            isRequired
            valueInput='id'
            textInput='orderBy'
            emptyItem={{ value: null, text: 'select-sort-by', isDisabled: false }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
          />
        </div>
        <div className='mt-1'>
          <ButtonBase
            className='btns theme-solid'
            onClick={orderBySubmitted}
            disabled={!selectedOrderBy.filterBy || !selectedOrderBy.orderBy}
          >
            <span>{t(`${translationPath}apply`)}</span>
          </ButtonBase>
        </div>
      </span>
    </div>
  );
};
MyLeadOrderByComponent.propTypes = {
  setOrderBy: PropTypes.func.isRequired,
  selectedOrderBy: PropTypes.func.isRequired,
  setSelectedOrderBy: PropTypes.func.isRequired,
  orderBy: PropTypes.instanceOf(Object).isRequired,
  orderFilter: PropTypes.instanceOf(Object).isRequired,
};
