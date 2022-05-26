import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import {
  Tables,
  Spinner,
  AutocompleteComponent,
  SelectComponet,
} from '../../../../../../Components';
import { TableActions, UnitsStatusEnum } from '../../../../../../Enums';
import { GetAllPropertyByPortfolioId } from '../../../../../../Services';
import { GetParams } from '../../../../../../Helper';

export const UnitsDetailsView = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [
    // activeCompanyItem,
    setActiveCompanyItem,
  ] = useState(null);
  const [PortfolioId, SetPortfolioId] = useState(null);
  const [
    // isOpenConfirm,
    setIsOpenConfirm,
  ] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  useEffect(() => {
    SetPortfolioId(+GetParams('id'));
  }, []);

  const getCompanyFinanceById = useCallback(async () => {
    setLoading(true);
    if (PortfolioId) {
      const result = await GetAllPropertyByPortfolioId(
        PortfolioId,
        filter.pageIndex,
        filter.pageSize
      );
      if (!(result && result.status && result.status !== 200)) setResponse(result);
      else setResponse({});
    }
    setLoading(false);
  }, [filter, PortfolioId]);

  useEffect(() => {
    getCompanyFinanceById();
  }, [getCompanyFinanceById]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const tableActionClicked = useCallback(async (actionEnum, item) => {
    setActiveCompanyItem(item);
    if (actionEnum === TableActions.deleteText.key) setIsOpenConfirm(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='associated-contacts-wrapper childs-wrapper properties-finance-wrapper'>
      <Spinner isActive={loading} />
      <div className='title-section-Portfolio'>
        <span>{t(`${translationPath}Properties`)}</span>
        <div className='select-conteaner'>
          <div className='filter-text'>Filter:</div>
          <div className='select-conteanerSelectComponet'>
            <SelectComponet
              idRef='cityRef'
              data={[
                { id: 1, city: '' },
                { id: 2, city: '' },
              ]}
              defaultValue={0}
              wrapperClasses='mb-2 px-2'
              themeClass='theme-underline'
              valueInput='id'
              textInput='city'
              placeholder='ss'
              emptyItem={{ value: 0, text: 'All status', isDisabled: false }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        </div>
      </div>
      <div className='d-flex mb-3  hedar-seaction '>
        <AutocompleteComponent
          idRef='activityTypeIdRef'
          labelValue='Search unit'
          // selectedValues={selected.activityType}
          multiple={false}
          data={[]}
          inputPlaceholder='Search by Ref No, Name, Property name…'
          // displayLabel={(option) => option.activityTypeName || ''}
          // groupBy={(option) => option.categoryName || ''}
          // getOptionSelected={(option) => option.activityTypeId === state.activityTypeId}
          withoutSearchButton
          // helperText={getErrorByName(schema, 'activityTypeId').message}
          // error={getErrorByName(schema, 'activityTypeId').error}
          // isLoading={loadings.activityTypes}
          isWithError
          // isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <div className='box' />
        <AutocompleteComponent
          idRef='activityTypeIdRef'
          labelValue='Management type'
          // selectedValues={selected.activityType}
          multiple={false}
          data={[]}
          inputPlaceholder='Select'
          // displayLabel={(option) => option.activityTypeName || ''}
          // groupBy={(option) => option.categoryName || ''}
          // getOptionSelected={(option) => option.activityTypeId === state.activityTypeId}
          withoutSearchButton
          // helperText={getErrorByName(schema, 'activityTypeId').message}
          // error={getErrorByName(schema, 'activityTypeId').error}
          // isLoading={loadings.activityTypes}
          isWithError
          // isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <div className='box' />
        <div className='bbt-mange'>
          <ButtonBase className='btns theme-solid '>
            <span>{t(`${translationPath}Manage`)}</span>
          </ButtonBase>
        </div>
      </div>
      <div className='w-100 px-2'>
        {/* "UnitNo": "Unit No",

  "": "Property Type",
  "": "Community",
  "PlotNo": "Plot. No",
  "": "Unit type",
  "": "Model",
  "": "View",
  "": "Builtup Area",
  "": "" */}
        <Tables
          data={response ? response.result : []}
          headerData={[
            {
              id: 1,
              label: t(`${translationPath}Ref.No`),
              input: 'unitTypeId',
            },
            {
              id: 2,
              label: t(`${translationPath}UnitNo`),
              input: 'unitId',
            },
            {
              id: 3,
              label: t(`${translationPath}PropertyName`),
              input: 'propertyName',
            },
            {
              id: 4,
              label: t(`${translationPath}PropertyType`),
              input: 'propertyTypeName',
            },
            {
              id: 5,
              label: t(`${translationPath}Community`),
              input: 'communityName',
            },
            {
              id: 6,
              label: t(`${translationPath}PlotNo`),
              component: (item) => <span>{(item.plotNo && item.plotNo) || 'N/A'}</span>,
            },
            {
              id: 7,
              label: t(`${translationPath}Unittype`),
              input: 'unitTypeName',
            },
            {
              id: 8,
              label: t(`${translationPath}Model`),
              component: (item) => <span>{(item.unitmodel && item.unitmodel) || 'N/A'}</span>,
            },
            {
              id: 10,
              label: t(`${translationPath}BuiltupArea`),
              component: (item) => <span>{(item.builtupArea && item.builtupArea) || 'N/A'}</span>,
            },
            {
              id: 11,
              label: t(`${translationPath}Status`),
              component: (item) => (
                <span className='bbt-Available'>
                  {t(
                    `${translationPath}${
                      Object.values(UnitsStatusEnum).findIndex(
                        (element) => element.key === item.status
                      ) !== -1 &&
                      Object.values(UnitsStatusEnum).find((element) => element.key === item.status)
                        .value
                    }`
                  ) || 'N/A'}
                </span>
              ),
            },
          ]}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          defaultActions={[
            {
              enum: TableActions.openFile.key,
              isDisabled: false,
              externalComponent: null,
            },
          ]}
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          activePage={filter.pageIndex}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={response ? response.totalCount : 0}
        />
      </div>
    </div>
  );
};

UnitsDetailsView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
