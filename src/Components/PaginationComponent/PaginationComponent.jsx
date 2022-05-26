import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Inputs, SelectComponet } from '../Controls';
import { PaginationEnum } from '../../Enums';

export const PaginationComponent = ({
  pageIndex,
  totalCount,
  pageSize,
  onPageIndexChanged,
  onPageSizeChanged,
  idRef,
  parentTranslationPath,
  translationPath,
  perPageText,
  pagesText,
  ofText,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [pageNumber, setPageNumber] = useState(pageIndex + 1);
  const pageChangeHandler = (keyValue) => () => {
    let value = pageIndex;
    if (keyValue === 'leftLast') value = 0;
    else if (keyValue === 'left') value -= 1;
    else if (keyValue === 'right') value += 1;
    else if (keyValue === 'rightLast') value = Math.floor(totalCount / pageSize);
    setPageNumber(value + 1);
    if (onPageIndexChanged && value !== pageIndex) onPageIndexChanged(value);
  };
  return (
    <div className='pagination-component-wrapper'>
      <div className='pagination-section'>
        <span className='fz-14px fw-medium'>
          {t(`${translationPath}${pagesText}`)}
          :
        </span>
        <ButtonBase
          className='btns-icon mx-2 theme-outline'
          disabled={pageIndex === 0}
          onClick={pageChangeHandler('leftLast')}
        >
          <span className='mdi mdi-chevron-double-left' />
        </ButtonBase>
        <ButtonBase
          className='btns-icon mx-2 theme-outline'
          disabled={pageIndex === 0}
          onClick={pageChangeHandler('left')}
        >
          <span className='mdi mdi-chevron-left' />
        </ButtonBase>
        <Inputs
          idRef={`${idRef}input`}
          value={pageNumber}
          type='number'
          wrapperClasses='mx-2 mb-0 pagination-input'
          onInputChanged={(event) => {
            let { value } = event.target;
            if (+value * pageSize >= totalCount) value = Math.ceil(totalCount / pageSize);
            setPageNumber(+value);
            if (Number.isNaN(+value) || +value < 1) return;
            if (onPageIndexChanged && value !== pageIndex + 1) onPageIndexChanged(+value - 1);
          }}
          min={1}
        />
        <ButtonBase
          className='btns-icon mx-2 theme-outline'
          disabled={pageNumber * pageSize >= totalCount}
          onClick={pageChangeHandler('right')}
        >
          <span className='mdi mdi-chevron-right' />
        </ButtonBase>
        <ButtonBase
          className='btns-icon mx-2 theme-outline'
          disabled={pageNumber * pageSize >= totalCount}
          onClick={pageChangeHandler('rightLast')}
        >
          <span className='mdi mdi-chevron-double-right' />
        </ButtonBase>
      </div>
      <div className='pagination-section'>
        <span className='fz-14px fw-medium'>{t(`${translationPath}${perPageText}`)}</span>
        <SelectComponet
          idRef={`${idRef}select`}
          data={Object.values(PaginationEnum)}
          value={pageSize}
          wrapperClasses='mx-1'
          themeClass='theme-solid'
          onSelectChanged={onPageSizeChanged}
          valueInput='key'
          textInput='value'

          //   translationPath={translationPath}
          //   translationPathForData={translationPath}
        />
        <span className='px-1'>{ pageIndex + 1}</span>
        <span className='mdi mdi-minus' />
        <span className='px-1'>{pageSize}</span>
        <span>{t(`${translationPath}${ofText}`)}</span>
        <span className='px-1'>{totalCount}</span>
      </div>
    </div>
  );
};

PaginationComponent.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  pageSize: PropTypes.oneOf(Object.keys(PaginationEnum).map((item) => +item)),
  idRef: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  perPageText: PropTypes.string,
  ofText: PropTypes.string,
  pagesText: PropTypes.string,
};
PaginationComponent.defaultProps = {
  idRef: 'paginationRef',
  parentTranslationPath: 'Shared',
  translationPath: 'pagination.',
  perPageText: 'card-per-page',
  pageSize: PaginationEnum[25].key,
  ofText: 'of',
  pagesText: 'pages',
};
