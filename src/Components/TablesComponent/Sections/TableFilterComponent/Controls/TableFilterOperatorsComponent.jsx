import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { TableFilterOperatorsEnum } from '../../../../../Enums';
import { PopoverComponent } from '../../../../PopoverComponent/PopoverComponent';

export const TableFilterOperatorsComponent = ({
  operators,
  selectedOperator,
  onSelectedOperatorChanged,
  parentTranslationPath,
  translationPath,
  FilterDisabledButton
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [tableFilterAttachedWith, setTableFilterAttachedWith] = useState(null);
  const handleClose = useCallback(() => {
    setTableFilterAttachedWith(null);
  }, []);
  const filterOperatorOpenHandler = useCallback((event) => {
    setTableFilterAttachedWith(event.currentTarget);
  }, []);
  const getOperatorValue = useCallback(
    (key) =>
      (Object.values(TableFilterOperatorsEnum).findIndex((item) => item.key === key) !== -1 &&
        Object.values(TableFilterOperatorsEnum).find((item) => item.key === key).value) ||
      '',
    []
  );

  return (
    (operators && (
      <div className='table-filter-operators-wrapper control-wrapper'>
        {(!FilterDisabledButton && (
          <ButtonBase
            className='btns-icon theme-solid table-filter-operators-btn'
            onClick={filterOperatorOpenHandler}
          >
            <span className='mdi mdi-filter-outline' />
          </ButtonBase>
        )
        ) || ''}
        {(FilterDisabledButton && (
          <ButtonBase
            className='btns-icon theme-solid table-filter-operators-btn'
          >
            <span className='mdi mdi-filter-outline' />
          </ButtonBase>
        )
        ) || ''}
        <PopoverComponent
          idRef='tableFilterOperatorPopRef'
          handleClose={handleClose}
          attachedWith={tableFilterAttachedWith}
          popoverClasses='table-filter-operator-popover'
          component={(
            <>
              {operators.map((item, index) => (
                <ButtonBase
                  key={`tableFilterOperatorItemRef${index + 1}${item.key}`}
                  className={`btns theme-transparent table-filter-operator-wrapper${(selectedOperator === item.key && ' active-filter-operator') || ''
                    }`}
                  disabled={item.isDisabled}
                  onClick={onSelectedOperatorChanged(item.key)}
                >
                  <span>{t(`${translationPath}${getOperatorValue(item.key)}`)}</span>
                </ButtonBase>
              ))}
            </>
          )}
        />
      </div>
    )) ||
    null
  );
};

TableFilterOperatorsComponent.propTypes = {
  operators: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOf(Object.values(TableFilterOperatorsEnum).map((item) => item.key)),
      isDisabled: PropTypes.bool,
    })
  ),
  // eslint-disable-next-line react/require-default-props
  selectedOperator: PropTypes.oneOf(
    Object.values(TableFilterOperatorsEnum).map((item) => item.key)
  ),
  onSelectedOperatorChanged: PropTypes.func,
  FilterDisabledButton: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
TableFilterOperatorsComponent.defaultProps = {
  operators: undefined,
  FilterDisabledButton: false,
  onSelectedOperatorChanged: () => { },
};
