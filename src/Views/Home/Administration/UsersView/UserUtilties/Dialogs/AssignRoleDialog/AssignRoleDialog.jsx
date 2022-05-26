import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { showSuccess, showError } from '../../../../../../../Helper';
import {
  Spinner,
  AutocompleteComponent,
  DialogComponent,
  CheckboxesComponent,
} from '../../../../../../../Components';
import { GetAllRoles } from '../../../../../../../Services/roleServices';
import {
  AssignRolesToUser,
  RemoveRolesFromUser,
  GetAllRolesByUserId,
} from '../../../../../../../Services/UsersServices/userServices';
import {
  OrganizationUserSearch
} from '../../../../../../../Services';
import {
  listingsaleagent,
  saleagent,
  leaseagent,
  listingleaseagent,
} from '../../../../../../../assets/json/StaticValue.json';
import './AssignRoleDialog.scss';

const AssignRoleDialog = ({
  userId,
  userFullName,
  isOpen,
  isOpenChanged,
  reloadData,
}) => {
  const [roles, setRoles] = useState({ result: [], totalCount: 0 });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [savedRoles, setSavedRoles] = useState({
    result: [],
    totalCount: 0,
  });
  const [refferdToList, setRefferdToList] = useState({ result: [], totalCount: 0 });
  const [roleAgent, setRoleAgent] = useState(null);
  const [refferdToAgent, setRefferdToAgent] = useState(null);
  const [optionsData, setOptionsData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [reffferdToId, setReffferdToId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [openDialogRoles, setopenDialogRoles] = useState(false);
  const { t } = useTranslation('UsersView');
  const translationPath = 'AssignRoleDialog.';
  const searchTimer = useRef(null);

  const getRoles = useCallback(async (value) => {
    setIsLoading(true);
    const response = await GetAllRoles(1, 20, value);

    setRoles({
      result: (response && response.result) || [],
      totalCount: (response && response.totalCount) || 0,
    });
    setIsLoading(false);
  }, []);

  const getSaleOrLeaseAgentsRoles = useCallback(async (searchValue, roleAgentId) => {
    setIsLoading(true);
    const filter = {
      pageSize: 25,
      name: searchValue,
      pageIndex: 1,
      userStatusId: 2,
      userTypeId: roleAgentId

    };
    const rs = await OrganizationUserSearch({ ...filter });
    if (!(rs && rs.status && rs.status !== 200))
      setRefferdToList({ result: rs.result, totalCount: rs.totalCount });
    else setRefferdToList({ result: [], totalCount: 0 });

    setIsLoading(false);
  });

  const getUserRoles = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllRolesByUserId(userId, 1, 30);
    setSavedRoles({
      result: (response && response.result) || [],
      totalCount: (response && response.totalCount) || 0,
    });
    setSelectedRoles(
      (response && response.result.map((item) => item.roles)) || []
    );
    setIsLoading(false);
  }, [userId]);

  const saveHandler = async (event) => {
    event.preventDefault();
    const notSavedRoles = selectedRoles.filter(
      (item) =>
        savedRoles.result.findIndex(
          (element) => element.rolesId === item.rolesId
        ) === -1
    );
    if (notSavedRoles.length === 0) {
      if (isOpenChanged) isOpenChanged();
      return;
    }
    setIsLoading(true);
    const assignedRoles = notSavedRoles.map((el) => ({
      usersId: userId,
      rolesId: el.rolesId,
    }));
    const response = await AssignRolesToUser(assignedRoles);
    setIsLoading(false);
    if (response) {
      showSuccess(t`${''}user-roles-saved-successfully`);
      getUserRoles();
      if (reloadData) reloadData();
      if (isOpenChanged) isOpenChanged();
    } else showError(t`${''}user-roles-save-failed`);
  };

  const deleteHandler = (savedDeletedRoles) => {
    setIsLoading(true);
    setdata(savedDeletedRoles);
    savedDeletedRoles.map(async (item) => {
      const response = await RemoveRolesFromUser(item.userRolesId);
      if (response) {
        setSelectedRoles((items) => {
          const deletedIndex = items.findIndex(
            (element) => element.rolesId === item.rolesId
          );
          if (deletedIndex > -1) items.splice(deletedIndex, 1);
          return [...items];
        });
        setSavedRoles((items) => {
          const deletedIndex = items.result.findIndex(
            (element) => element.rolesId === item.rolesId
          );
          if (deletedIndex > -1) {
            items.result.splice(deletedIndex, 1);
            --items.totalCount;
          }
          return { ...items };
        });
        if (reloadData) reloadData();
      }
    });
    setopenDialogRoles(false);
    setIsLoading(false);
  };

  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      getRoles(value);
    }, 700);
  };

  useEffect(() => {
    setOptionsData(
      selectedRoles.concat(
        roles.result.filter(
          (item) =>
            selectedRoles.findIndex(
              (selectedItem) => selectedItem.rolesId === item.rolesId
            ) === -1
        )
      )
    );
  }, [roles.result, selectedRoles]);

  useEffect(() => {
    if (userId) getUserRoles();
  }, [getUserRoles, userId]);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  useEffect(() => {
    if (!isChecked)
    setRefferdToAgent(null);
  }, [isChecked]);

  return (
    <DialogComponent
      titleText={`${t(`${translationPath}save-changes`)} ${userFullName}`}
      saveText={t(`${translationPath}save-changes`)}
      dialogContent={(
        <div className='asign-role-dialog view-wrapper'>
          <Spinner isActive={isLoading} />
          <div>
            <DialogComponent
              maxWidth='sm'
              saveType='button'
              saveText='confirm'
              disableBackdropClick
              titleText={t(`${translationPath}Remove-Assigned-Lead`)}
              dialogContent={(
                <div>
                  <div className='remove-assigned-lead'>
                    <span className='mdi mdi-24px mdi-account-multiple-remove-outline' />
                  </div>
                  {t(`${translationPath}Warning`)}
                  <div className='remove-Sale-Lease-assigned-lead'>
                    <CheckboxesComponent
                      idRef='RotationRef'
                      themeClass='theme-secondary'
                      singleChecked={isChecked}
                      onSelectedCheckboxClicked={() =>
                        setIsChecked(!isChecked)}
                    />
                    <div className='center'>
                      {t(`${translationPath}select-agent-refferd-to`)}
                      {' '}
                      {roleAgent && roleAgent.roles && roleAgent.roles.rolesName}

                    </div>

                  </div>

                  {isChecked && (
                    <div>

                      <AutocompleteComponent
                        idRef='roleAgentRef'
                        data={(refferdToList && refferdToList.result) || []}
                        selectedValues={refferdToAgent || null}
                        onInputChange={(e) => {
                          if (e && e.target && e.target.value) {
                            const searchValue = e.target.value;
                            setTimeout(() => {
                              getSaleOrLeaseAgentsRoles(searchValue, (roleAgent && roleAgent.rolesId) || null);
                            }, 300);
                          }
                        }}
                        multiple={false}
                        displayLabel={(option) =>
                          (option && option.fullName) || ''}
                        chipsLabel={(option) => (option && option.fullName) || ''}
                        withoutSearchButton
                        parentTranslationPath={translationPath}
                        translationPath={translationPath}
                        onChange={(event, newValue) => {
                          setReffferdToId((newValue && newValue.id) || null);
                          setRefferdToAgent(newValue || null);
                        }}
                      />

                    </div>

                  )}

                  <div className='d-flex-v-center-h-end flex-wrap mt-3'>
                    <Button
                      className='MuiButtonBase-root MuiButton-root MuiButton-text MuiButtonBase-root btns theme-transparent mb-2'
                      type='button'
                      onClick={() => {
                        setopenDialogRoles(false);
                        setIsChecked(false);
                      }}
                    >
                      <span className='MuiButton-label'>
                        <span className='mx-2'>
                          {t(`${translationPath}Cancel`)}
                        </span>

                        <span className='MuiTouchRipple-root' />
                      </span>
                      <span className='MuiTouchRipple-root' />
                    </Button>
                    <Button
                      className='MuiButtonBase-root btns theme-solid mb-2'
                      type='button'
                      onClick={() => deleteHandler(data)}
                    >
                      <span className='MuiButton-label'>
                        <span className='mx-2'>
                          {t(`${translationPath}continue-anyway`)}
                        </span>
                      </span>
                      <span className='MuiTouchRipple-root' />
                    </Button>
                  </div>
                </div>
              )}
              onCloseClicked={() => {
                setopenDialogRoles(false);
                 setIsChecked(false);
                 }}
              isOpen={openDialogRoles}
            />
          </div>
          <div className='form-item'>
            <AutocompleteComponent
              idRef='userRoleRef'
              labelValue={t(`${translationPath}user-roles`)}
              inputPlaceholder={t(`${translationPath}user-roles`)}
              selectedValues={selectedRoles}
              data={optionsData}
              chipsLabel={(option) =>
                (option.rolesName && option.rolesName) || ''}
              displayLabel={(option) =>
                (option.rolesName && option.rolesName) || ''}
              getOptionSelected={(option) =>
                selectedRoles &&
                selectedRoles.findIndex(
                  (item) => item.rolesId === option.rolesId
                ) !== -1}
              withoutSearchButton
              onInputKeyUp={(e) => searchHandler(e)}
              onChange={(event, newValue) => {
                if (
                  newValue.length > selectedRoles.length ||
                  !savedRoles ||
                  !savedRoles.result ||
                  savedRoles.result.length === 0
                )
                  setSelectedRoles(newValue);
                else {
                  const deletedItems = selectedRoles.filter(
                    (item) =>
                      newValue.findIndex(
                        (newItem) => newItem.rolesId === item.rolesId
                      ) === -1
                  );
                  const localDeletedItems = deletedItems.filter(
                    (deletedItem) =>
                      savedRoles.result.findIndex(
                        (item) => deletedItem.rolesId === item.rolesId
                      ) === -1
                  );
                  const savedDeletedItems = savedRoles.result.filter(
                    (item) =>
                      deletedItems.findIndex(
                        (deletedItem) => deletedItem.rolesId === item.rolesId
                      ) !== -1
                  );

                  const saveitem = savedRoles.result.find(
                    (item) =>
                      deletedItems.findIndex(
                        (deletedItem) => deletedItem.rolesId === item.rolesId
                      ) !== -1
                  );

                  if (localDeletedItems.length > 0) {
                    setSelectedRoles((items) =>
                      items.filter(
                        (selectedItems) =>
                          localDeletedItems.findIndex(
                            (localDeletedItem) =>
                              localDeletedItem.rolesId === selectedItems.rolesId
                          ) === -1
                      ));
                  }

                  if (
                    (saveitem && saveitem.rolesId === saleagent) ||
                    (saveitem && saveitem.rolesId === leaseagent) ||
                    (saveitem && saveitem.rolesId === listingsaleagent) ||
                    (saveitem && saveitem.rolesId === listingleaseagent)
                  ) {
                    getSaleOrLeaseAgentsRoles('', saveitem.rolesId);
                    setRoleAgent(saveitem);
                    setopenDialogRoles(true);
                    setdata(savedDeletedItems);
                  } else
                    deleteHandler(savedDeletedItems);
                }
              }}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={() => {
        setSelectedRoles(
          (savedRoles && savedRoles.result.map((item) => item.roles)) || []
        );
        isOpenChanged();
      }}
      onCancelClicked={() => {
        setSelectedRoles(
          (savedRoles && savedRoles.result.map((item) => item.roles)) || []
        );
        isOpenChanged();
      }}
    />
  );
};

export { AssignRoleDialog };
AssignRoleDialog.propTypes = {
  userFullName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func,
};
AssignRoleDialog.defaultProps = {
  reloadData: undefined,
};
