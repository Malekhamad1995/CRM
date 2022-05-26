import React, {
 useCallback, useState, useRef, memo, useEffect
} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import moment from 'moment';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';
import { TableActions, TableFilterOperatorsEnum, TableFilterTypesEnum } from '../../Enums';
import {
 bottomBoxComponentUpdate, opnfouces, preventCopy, ProtectCopiedFun, ProtectCopiedFundelete
} from '../../Helper';
import { useOnClickOutside } from '../../Hubs';
import { useEventListener, useLocalStorage } from '../../Hooks';
import { PaginationComponent } from '../PaginationComponent/PaginationComponent';
import { PopoverComponent } from '../PopoverComponent/PopoverComponent';
import { CheckboxesComponent } from '../Controls';
import { TableFilterComponent } from './Sections';

const Tables = memo(
  ({
    tableOptions,
    parentTranslationPath,
    translationPath,
    data,
    activePage,
    totalItems,
    activePageChanged,
    itemsPerPageChanged,
    itemsPerPage,
    headerData,
    footerData,
    selectAllOptions,
    sortColumnClicked,
    defaultActions,
    actionsOptions,
    focusedRowChanged,
    isOriginalPagination,
    onPageIndexChanged,
    onPageSizeChanged,
    dateFormat,
    externalPopoverComponent,
    isSellectAllDisabled,
    bodyRowId,
    tableFilterClassWrapper,
    filterValues,
    onFilterValuesChanged,
    filterData,
    textInputPlaceholder,
    isWithFilter,
    setSortBy,
    isWithCheckboxColumn,
    FilterDisabledButton
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [language] = useLocalStorage('localization', {
      currentLanguage: 'en',
      isRtl: false,
    });
    const buttonRef = useRef(null);

    const [currentOrderById, setCurrentOrderById] = useState(-1);
    const [actionsAttachedWith, setActionsMenuAttachedWith] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [currentOrderDirection, setCurrentOrderDirection] = useState('desc');
    const tableRef = useRef(null);
    const [focusedRow, setFocusedRow] = useState(-1);
    const descendingComparator = (a, b, orderBy) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    };
    const getComparator = (order, orderBy) =>
      (order === 'desc' ?
        (a, b) => descendingComparator(a, b, orderBy) :
        (a, b) => -descendingComparator(a, b, orderBy));
    const createSortHandler = useCallback(
      (columnItem) => () => {
        if (setSortBy)
        setSortBy({ filterBy: (columnItem.input && columnItem.input[0].toUpperCase() + columnItem.input.slice(1)) || null, orderBy: (currentOrderDirection === 'desc' ? 2 : 1) });

        if (!tableOptions) return;
        setCurrentOrderDirection((item) => (item === 'desc' ? 'asc' : 'desc'));
         setCurrentOrderById(columnItem.id);
        if (tableOptions.sortFrom === 2) sortColumnClicked(columnItem.id, currentOrderDirection);
      },
      [currentOrderDirection, tableOptions, sortColumnClicked]
    );
    const stableSort = (array, comparator) => {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    };
    const getCurrentSelectedItem = useCallback(
      (itemIndex) =>
        (selectAllOptions ?
          (selectAllOptions.selectedRows &&
              selectAllOptions.selectedRows.findIndex((item) => item === itemIndex + activePage) !==
                -1) ||
            selectAllOptions.isSelectAll :
          false),
      [activePage, selectAllOptions]
    );
    const getCurrentDisabledItem = useCallback(
      (itemIndex) =>
        (selectAllOptions ?
          selectAllOptions.disabledRows.findIndex((item) => item === itemIndex + activePage) :
          -1),
      [activePage, selectAllOptions]
    );
    const handleClose = useCallback(() => {
      setActionsMenuAttachedWith(null);
    }, []);
    const handleOpen = useCallback(() => {
      setActionsMenuAttachedWith(buttonRef);
    }, []);
    const bodyRowClicked = useCallback(
      (rowIndex, item) => {
        setActiveItem(item);
        if (focusedRow === -1 || focusedRow !== rowIndex) {
          setFocusedRow(() => {
            focusedRowChanged(rowIndex, item);
            return rowIndex;
          });
        } else {
          setFocusedRow(() => {
            focusedRowChanged(-1);
            return -1;
          });
        }
      },
      [focusedRow, focusedRowChanged]
    );
    const getTableActionValue = (key) =>
      Object.values(TableActions).find((item) => item.key === key);
    const getSortDataName = () => {
      const currentHeader = headerData.find((item) => item.id === currentOrderById);
      if (currentHeader) return currentHeader.input;
      return null;
    };
    useOnClickOutside(tableRef, (e) => {
      handleClose();
      if (
        e.target &&
        e.target.className &&
        typeof e.target.className === 'string' &&
        (e.target.className.includes('actions-wrapper') ||
          e.target.className.includes('table-action-btn') ||
          e.target.className.includes('table-action-icon'))
      )
        return;
      if (focusedRow !== -1) setFocusedRow(-1);
    });
    const TableTooltip = () => {
      const [lastClientWidth, setLastClientWidth] = useState();

      const rowRef = document.getElementById(`${bodyRowId}${focusedRow * (activePage + 1)}`);
      const [coordinations, setCoordinations] = useState(
        () => (rowRef && rowRef.getBoundingClientRect()) || { right: 0 }
      );
      const [tableCoordinations, setTableCoordinations] = useState(
        (tableRef && tableRef.current && tableRef.current.getBoundingClientRect()) || { right: 0 }
      );
      const timer = useRef(null);
      const innerTime = useRef(null);
      const sizeRecheckTime = useRef(null);
      const [opacity, setOpacity] = useState(0);
      const [transition, setTransition] = useState(null);

      const updateCoordinations = useCallback(() => {
        setOpacity(0);
        setTransition(null);
        if (timer.current !== null) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          setTransition('opacity 0.3s linear');
          if (innerTime.current !== null) clearTimeout(innerTime.current);
          innerTime.current = setTimeout(() => {
            // do something
            if (rowRef) setCoordinations(rowRef.getBoundingClientRect());
            setOpacity(1);
          }, 300);
        }, 299);
      }, [rowRef]);
      const sizeRechecker = useCallback(() => {
        if (rowRef && rowRef.current) {
          if (!lastClientWidth || rowRef.current.clientWidth !== lastClientWidth) {
            setLastClientWidth(rowRef.current.clientWidth);
            if (sizeRecheckTime.current !== null) clearTimeout(sizeRecheckTime.current);
            sizeRecheckTime.current = setTimeout(() => {
              if (!lastClientWidth || lastClientWidth !== rowRef.current.clientWidth)
                sizeRechecker();
            }, 50);
          }
        }
      }, [lastClientWidth, rowRef]);
      const updateSize = useCallback(() => {
        setOpacity(0);
        setTransition(null);
        if (tableRef.current) setTableCoordinations(tableRef.current.getBoundingClientRect());
        if (timer.current !== null) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          setTransition('opacity 0.3s linear');
          innerTime.current = setTimeout(() => {
            // do something
            if (rowRef) setTableCoordinations(tableRef.current.getBoundingClientRect());
            setOpacity(1);
          }, 249);
        }, 250);
        sizeRechecker();
      }, [rowRef, sizeRechecker]);

      useEventListener('resize', () => updateSize());
      useEventListener('scroll', updateCoordinations);
      useEffect(() => {
        updateSize();
      }, [updateSize]);
      useEffect(
        () => () => {
          if (timer.current !== null) clearTimeout(timer.current);
          if (sizeRecheckTime.current !== null) clearTimeout(sizeRecheckTime.current);
          if (innerTime.current !== null) clearTimeout(innerTime.current);
        },
        []
      );
      return (
        <div
          className={`table-actions-wrapper ${actionsOptions.classes || ''}`}
          style={{
            top: Math.abs(coordinations.top - tableCoordinations.top),
            right: !language.isRtl ? 0 : 'initial',
            left: language.isRtl ? 0 : 'initial',
            height: coordinations.height,
            opacity,
            transition,
          }}
        >
          {(actionsOptions.actions || defaultActions || []).map((item, index) => (
            <React.Fragment key={`tableAction${index + 1}`}>
              {(item.enum !== TableActions.externalComponent &&
                (!item.isHidden || (item.isHidden && item.isHidden(activeItem))) && (
                  <Tooltip title={item.title && item.title}>
                    <Button
                      ref={buttonRef}
                      className={getTableActionValue(item.enum).buttonClasses}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (actionsOptions && actionsOptions.onActionClicked) {
                          if (item.enum === 'dotsHorizontal') handleOpen();
                          actionsOptions.onActionClicked(
                            item.enum,
                            data[focusedRow],
                            focusedRow,
                            event
                          );
                        }
                      }}
                      disabled={item.isDisabled || actionsOptions.isDisabled}
                    >
                      <span className={getTableActionValue(item.enum).icon} />
                      {getTableActionValue(item.enum).label && (
                        <span className={getTableActionValue(item.enum).labelClasses}>
                          {t(getTableActionValue(item.enum).label)}
                        </span>
                      )}
                    </Button>
                  </Tooltip>
                )) ||
                (actionsOptions.externalComponent && actionsOptions.externalComponent(item)) ||
                undefined}
              {(actionsAttachedWith && (
                <PopoverComponent
                  idRef='actionsPopRef'
                  handleClose={handleClose}
                  attachedWith={actionsAttachedWith.current}
                  popoverClasses='popover-contact-prefernces'
                  component={externalPopoverComponent}
                />
              )) ||
                undefined}
            </React.Fragment>
          ))}
        </div>
      );
    };
    const dataReturn = (dataItem, columnPath) => {
      if (!dataItem) return '';
      if (!columnPath) return (typeof dataItem !== 'object' && dataItem) || '';
      if (!columnPath.includes('.')) return dataItem[columnPath];
      let a = dataItem;
      columnPath.split('.').map((item) => {
        if (a) a = a[item];
        return item;
      });
      return a;
    };
    useEffect(() => {
      if (!isOriginalPagination && onPageIndexChanged) {
        bottomBoxComponentUpdate(
          <PaginationComponent
            pageIndex={activePage}
            pageSize={itemsPerPage}
            totalCount={totalItems}
            perPageText='row-per-page'
            translationPath=''
            parentTranslationPath='Shared'
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        );
      }
    });
    useEffect(
      () => () => {
        bottomBoxComponentUpdate(null);
      },
      []
    );
    return (
      <div
        className='w-100 table-responsive'
        ref={tableRef}
        onMouseEnter={ProtectCopiedFun}
        onMouseLeave={ProtectCopiedFundelete}
        onFocus={opnfouces}
      >
        <TableContainer>
          <Table
            className='table-wrapper'
            aria-labelledby='tableTitle'
            size={tableOptions.tableSize} // 'small' or 'medium'
            aria-label='enhanced table'
          >
            <TableHead>
              <TableRow>
                {/* {isCollapsed && <TableCell></TableCell>} */}
                {selectAllOptions && (
                  <TableCell padding='checkbox'>
                    {!isSellectAllDisabled && (
                      <CheckboxesComponent
                        idRef='tableSelectAllRef'
                        singleIndeterminate={
                          selectAllOptions.selectedRows &&
                          selectAllOptions.selectedRows.length > 0 &&
                          selectAllOptions.selectedRows.length < totalItems &&
                          !selectAllOptions.isSelectAll
                        }
                        singleChecked={
                          (totalItems > 0 &&
                            selectAllOptions.selectedRows &&
                            selectAllOptions.selectedRows.length === totalItems) ||
                          selectAllOptions.isSelectAll
                        }
                        isDisabled={selectAllOptions.isDisableAll}
                        onSelectedCheckboxClicked={selectAllOptions.onSelectAllClicked}
                      />
                    )}
                  </TableCell>
                )}
                {headerData
                  .filter((column) => !column.isHidden)
                  .map((item, index) => (
                    <TableCell
                      key={`headerCell${index + 1}`}
                      sortDirection={
                        item.isSortable && currentOrderById === item.id ?
                          currentOrderDirection :
                          false
                      }
                    >
                      {item.isSortable ? (
                        <TableSortLabel
                          active={currentOrderById === item.id}
                          direction={currentOrderById === item.id ? currentOrderDirection : 'desc'}
                          onClick={createSortHandler(item)}

                        >
                          {t(`${translationPath}${item.label}`)}
                        </TableSortLabel>
                      ) : (
                        t(`${translationPath}${item.label}`)
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isWithFilter && (
                <TableFilterComponent
                  tableFilterClassWrapper={tableFilterClassWrapper}
                  filterValues={filterValues}
                  onFilterValuesChanged={onFilterValuesChanged}
                  filterData={filterData}
                  FilterDisabledButton={FilterDisabledButton}
                  isWithCheckboxColumn={isWithCheckboxColumn}
                  textInputPlaceholder={textInputPlaceholder}
                />
              )}
              {data
                .slice(
                  data.length <= itemsPerPage ? 0 : activePage * itemsPerPage,
                  data.length <= itemsPerPage ?
                    itemsPerPage :
                    activePage * itemsPerPage + itemsPerPage
                )
                .map((row, rowIndex) => {
                  const isItemSelected = getCurrentSelectedItem(rowIndex);
                  const isItemDisabled = getCurrentDisabledItem(rowIndex) !== -1;
                  return (
                    <React.Fragment key={`bodyRow${rowIndex * (activePage + 1)}`}>
                      <TableRow
                        role='checkbox'
                        aria-checked={
                          (selectAllOptions &&
                            selectAllOptions.getIsSelected &&
                            selectAllOptions.getIsSelected(row, rowIndex)) ||
                          isItemSelected
                        }
                        tabIndex={-1}
                        selected={
                          (selectAllOptions &&
                            selectAllOptions.getIsSelected &&
                            selectAllOptions.getIsSelected(row, rowIndex)) ||
                          isItemSelected
                        }
                        id={`${bodyRowId}${rowIndex * (activePage + 1)}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          bodyRowClicked(rowIndex, row);
                        }}
                        className={rowIndex === focusedRow ? 'table-row-overlay' : ''}
                      >
                        {(selectAllOptions) ? (
                          <TableCell padding='checkbox'>
                            <CheckboxesComponent
                              idRef={`tableSelectRef${rowIndex + 1}`}
                              singleChecked={
                                (selectAllOptions &&
                                  selectAllOptions.getIsSelected &&
                                  selectAllOptions.getIsSelected(row, rowIndex)) ||
                                isItemSelected ||
                                false
                              }
                              isDisabled={
                                selectAllOptions.isDisableAll ||
                                (selectAllOptions.getIsDisabled &&
                                  selectAllOptions.getIsDisabled(row, rowIndex)) ||
                                isItemDisabled
                              }
                              onSelectedCheckboxClicked={(event) => {
                                event.stopPropagation();
                                selectAllOptions.onSelectClicked(row, rowIndex);
                              }}
                            />
                          </TableCell>
                        ) : null}
                        {headerData.length > 0 &&
                          headerData
                            .filter((column) => !column.isHidden)
                            .map((column, columnIndex) => (
                              <TableCell
                                key={`bodyColumn${columnIndex * (activePage + 1) + rowIndex}`}
                                className={column.cellClasses || ''}
                              >
                                {(column.isDate &&
                                  ((dataReturn(row, column.input) &&
                                    moment(dataReturn(row, column.input)).format(
                                      column.dateFormat || tableOptions.dateFormat || dateFormat
                                    )) ||
                                    '')) ||
                                  (column.component &&
                                    column.component(row, rowIndex, column, columnIndex)) ||
                                  dataReturn(row, column.input)}
                              </TableCell>
                            ))}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
            {footerData && footerData.length > 0 && (
              <TableFooter className='footer-wrapper'>
                <TableRow>
                  {footerData.map((item, index) => (
                    <TableCell colSpan={item.colSpan} key={`footerCell${index + 1}`}>
                      {(item.component && item.component(item, index)) || item.value}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
        {(actionsOptions || defaultActions) &&
          (actionsOptions.actions || defaultActions).length > 0 &&
          !actionsOptions.isDisabled &&
          focusedRow !== -1 && <TableTooltip />}
        {isOriginalPagination && (
          <TablePagination
            rowsPerPageOptions={tableOptions.itemsPerPageOptions}
            component='div'
            count={totalItems}
            rowsPerPage={itemsPerPage}
            page={activePage}
            labelRowsPerPage={t('Shared:tables.rows-per-page')}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${t('Shared:tables.of')} ${count !== -1 ? count : to}`}
            nextIconButtonText={t('Shared:tables.next-page')}
            backIconButtonText={t('Shared:tables.previous-page')}
            nextIconButtonProps={{
              className: 'btns-icon theme-transparent mx-2',
            }}
            backIconButtonProps={{
              className: 'btns-icon theme-transparent mx-2',
            }}
            SelectProps={{
              className: 'select-wrapper',
            }}
            onChangePage={activePageChanged}
            onChangeRowsPerPage={itemsPerPageChanged}
            className='pagination-wrapper'
          />
        )}
      </div>
    );
  }
);
Tables.defaultProps = {
  setSortBy: undefined,
  isSellectAllDisabled: false,
  dateFormat: 'YYYY-MM-DD',
  tableOptions: {
    itemsPerPageOptions: [10, 20, 25, 50, 100],
    tableSize: 'small',
    dateFormat: null,
    sortFrom: 1, // 1:front,2:do nothing only send that it change
  },
  translationPath: '',
  parentTranslationPath: '',
  isOriginalPagination: false,
  itemsPerPage: 10,
  activePageChanged: undefined,
  itemsPerPageChanged: undefined,
  defaultActions: [
    {
      enum: TableActions.openFile.key,
      isDisabled: false,
      externalComponent: null,
    },
    {
      enum: TableActions.editText.key,
      isDisabled: false,
      externalComponent: null,
    },
    {
      enum: TableActions.phoneSolid.key,
      isDisabled: false,
      externalComponent: null,
    },
    {
      enum: TableActions.emailSolid.key,
      isDisabled: false,
      externalComponent: null,
    },
    {
      enum: TableActions.dotsHorizontal.key,
      isDisabled: false,
      externalComponent: null,
    },
  ],
  actionsOptions: {
    classes: '',
    isDisabled: false,
    isReverceDisabled: false,
    onActionClicked: () => {},
    actionsIsDisabledInput: null,
  },
  selectAllOptions: null,
  sortColumnClicked: () => {},
  headerData: [],
  data: [],
  footerData: [],
  focusedRowChanged: () => {},
  onPageIndexChanged: undefined,
  onPageSizeChanged: undefined,
  externalPopoverComponent: undefined,
  bodyRowId: 'bodyRowRef',
  // filter
  tableFilterClassWrapper: '',
  filterData: undefined,
  filterValues: undefined,
  onFilterValuesChanged: undefined,
  textInputPlaceholder: 'search',
  isWithFilter: false,
};
export { Tables };
