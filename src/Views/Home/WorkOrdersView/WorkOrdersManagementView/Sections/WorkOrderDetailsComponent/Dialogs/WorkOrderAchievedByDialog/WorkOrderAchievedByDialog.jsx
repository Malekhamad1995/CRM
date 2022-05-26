import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { ButtonBase } from '@material-ui/core';
import { AutocompleteComponent, DialogComponent } from '../../../../../../../../Components';
import { getErrorByName, showError } from '../../../../../../../../Helper';
import { OrganizationUserSearch } from '../../../../../../../../Services';

export const WorkOrderAchievedByDialog = ({
  isFromDialog,
  isOpen,
  isOpenChanged,
  onSave,
  stateWorkOrderUsers,
  selectedWorkAchievedBy,
  workAchievedByList,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [workAchievedBy, setWorkAchievedBy] = useState([]);
  const [isLoadings, setIsLoadings] = useState([]);
  const searchTimer = useRef(null);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [state, setState] = useState([]);
  const [selected, setSelected] = useState([]);
  const getAllWorkAchievedBy = useCallback(
    async (value, selectedValue, index) => {
      setIsLoadings((items) => {
        const localIndex = items.findIndex((item) => item === index);
        if (localIndex === -1) items.push(index);
        return [...items];
      });
      const res = await OrganizationUserSearch({
        ...filter,
        userName: value,
      });
      if (!(res && res.status && res.status !== 200)) {
        setWorkAchievedBy((items) => {
          if (items.length === index) {
            items.push(
              (selectedValue &&
                ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
                (res && res.result) ||
                []
            );
          } else {
            items.splice(
              index,
              1,
              (selectedValue &&
                ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
                (res && res.result) ||
                []
            );
          }
          return [...items];
        });
      } else {
        setWorkAchievedBy((items) => {
          if (items.length === index) items.push([]);
          else items.splice(index, 1, []);
        });
      }
      setIsLoadings((items) => {
        const localIndex = items.findIndex((item) => item === index);
        if (localIndex !== -1) items.splice(localIndex, 1);
        return [...items];
      });
    },
    [filter]
  );
  const schema = Joi.array()
    .items(
      Joi.object({
        usersId: Joi.any()
          .custom((value, helpers) => {
            if (!value) return helpers.error('state.achievedByNotSet');
            if (value && state.filter((item) => item.usersId === value).length > 1)
              return helpers.error('state.achievedByRepeatedValue');
            return value;
          })
          .messages({
            'state.achievedByNotSet': t(`${translationPath}achieved-by-is-required`),
            'state.achievedByRepeatedValue': t(
              `${translationPath}can-not-select-same-achieved-by-more-than-once`
            ),
          }),
      })
    )

    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getIsLoading = useCallback((index) => isLoadings.includes(index), [isLoadings]);
  const workOrderAchievedHandler = useCallback(
    (process, index, item) => () => {
      if (process === 'add') {
        setWorkAchievedBy((items) => {
          items.splice(index + 1, 0, []);
          return [...items];
        });
        setSelected((items) => {
          items.splice(index + 1, 0, null);
          return [...items];
        });
        setState((items) => {
          items.splice(index + 1, 0, {
            usersId: null,
            isAchievedBy: true,
            isAssignedBy: false,
            isAssignedTo: false,
          });
          return [...items];
        });
        getAllWorkAchievedBy(undefined, undefined, index + 1);
      } else {
        setState((items) => {
          items.splice(index, 1);
          return [...items];
        });
        setSelected((items) => {
          const selectedIndex = items.findIndex((element) => element.id === item.usersId);
          if (selectedIndex !== -1) items.splice(index, 1);
          return [...items];
        });
        setWorkAchievedBy((items) => {
          items.splice(index, 1);
          return [...items];
        });
      }
    },
    [getAllWorkAchievedBy]
  );
  const saveHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    if (onSave) onSave(state, selected, workAchievedBy);
  };
  useEffect(() => {
    if (isOpen && isFirstLoad) {
      setIsFirstLoad(false);
      if (stateWorkOrderUsers.length > state) setState(stateWorkOrderUsers);
      if (selectedWorkAchievedBy.length > selected) setSelected(selectedWorkAchievedBy);
      if (workAchievedByList.length > workAchievedBy) setWorkAchievedBy(workAchievedByList);
    }
  }, [
    isFirstLoad,
    isOpen,
    selected,
    selectedWorkAchievedBy,
    state,
    stateWorkOrderUsers,
    workAchievedBy,
    workAchievedByList,
  ]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <DialogComponent
      titleText='work-order-achieved-by'
      saveText='save'
      maxWidth='sm'
      dialogContent={(
        <div className='work-achieved-by-management-dialog view-wrapper'>
          {state &&
            state.map((item, index) => (
              <div className='w-100 mb-2 d-flex' key={`workAchievedByKey${index + 1}`}>
                <AutocompleteComponent
                  idRef='workAchievedByRef'
                  labelValue={`${t(`${translationPath}achieved-by`)} (${index + 1})`}
                  selectedValues={(selected.length > index && selected[index]) || null}
                  multiple={false}
                  data={
                    (workAchievedBy && workAchievedBy.length > index && workAchievedBy[index]) || []
                  }
                  displayLabel={(option) => option.fullName || ''}
                  renderOption={(option) =>
                    ((option.userName || option.fullName) &&
                      `${option.fullName} (${option.userName})`) ||
                    ''}
                  getOptionSelected={(option) =>
                    state && state.length > index && option.id === state[index].usersId}
                  withoutSearchButton
                  helperText={getErrorByName(schema, `${index}.usersId`).message}
                  error={getErrorByName(schema, `${index}.usersId`).error}
                  isLoading={getIsLoading(index)}
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllWorkAchievedBy(
                        value,
                        (selected && selected.length > index && selected[index]) || null,
                        index
                      );
                    }, 700);
                  }}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setSelected((items) => {
                      if (items.length === index) items.push(newValue);
                      else items.splice(index, 1, newValue);
                      return [...items];
                    });
                    setState((items) => {
                      if (items.length === index) {
                        items.push({
                          usersId: (newValue && newValue.id) || null,
                          isAchievedBy: true,
                          isAssignedBy: false,
                          isAssignedTo: false,
                        });
                      } else {
                        items.splice(index, 1, {
                          usersId: (newValue && newValue.id) || null,
                          isAchievedBy: true,
                          isAssignedBy: false,
                          isAssignedTo: false,
                        });
                      }
                      return [...items];
                    });
                  }}
                />
                {state.length > 1 && (
                  <ButtonBase
                    className='btns-icon theme-solid mx-2 mt-3P5 bg-warning'
                    onClick={workOrderAchievedHandler('remove', index, item)}
                  >
                    <span className='mdi mdi-minus' />
                  </ButtonBase>
                )}
                <ButtonBase
                  className='btns-icon theme-solid mx-2 mt-3P5'
                  onClick={workOrderAchievedHandler('add', index)}
                >
                  <span className='mdi mdi-plus' />
                </ButtonBase>
              </div>
            ))}
        </div>
      )}
      isOpen={isOpen}
      onSubmit={(!isFromDialog && saveHandler) || undefined}
      onSaveClicked={(isFromDialog && saveHandler) || undefined}
      saveType={(isFromDialog && 'button') || 'submit'}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

WorkOrderAchievedByDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isFromDialog: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  stateWorkOrderUsers: PropTypes.instanceOf(Array).isRequired,
  selectedWorkAchievedBy: PropTypes.instanceOf(Array).isRequired,
  workAchievedByList: PropTypes.instanceOf(Array).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
