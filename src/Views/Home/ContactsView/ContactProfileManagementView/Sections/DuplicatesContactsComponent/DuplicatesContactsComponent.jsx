import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Spinner, ViewTypes } from '../../../../../../Components';
import { GetDuplicatedContactByContactId } from '../../../../../../Services';
import { ViewTypesEnum } from '../../../../../../Enums';
import { GetParams, GlobalHistory } from '../../../../../../Helper';
import { DuplicatesContactsComponenets } from './DuplicatesContactsUtilities/DuplicatesContactsComponenets';
import { ContactsMapper } from '../../../ContactsUtilities';

export const DuplicatesContactsComponent = ({
  parentTranslationPath,
  translationPath,
  setActiveTab,
}) => {
  const [checkedCards, setCheckedCards] = useState([]);
  const [checkedCardsIds, setCheckedCardsIds] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionType, setActiveActionType] = useState(
    ViewTypesEnum.tableView.key
  );
  const [duplicatesContacts, setDuplicatesContacts] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const getAllDuplicateContact = useCallback(async () => {
    setIsLoading(true);
    const res = await GetDuplicatedContactByContactId(
      filter.pageIndex + 1,
      filter.pageSize,
      GetParams('id')
    );
    if (!(res && res.status && res.status !== 200)) {
      setDuplicatesContacts({
        result: ((res && res.result) || []).map((item) => ContactsMapper(item)),
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setDuplicatesContacts({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  const onTypeChanged = useCallback((activeType) => {
    setActiveActionType(activeType);
  }, []);
  useEffect(() => {
    if (GetParams('id')) getAllDuplicateContact();
  }, [getAllDuplicateContact]);

  return (
    <div className='associated-contacts-wrapper childs-wrapper p-relative'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='header-section'>
        <div className='filter-section px-2'>
          <div className='section mt-1'>
            <ButtonBase
              className='btns theme-solid px-3'
              disabled={checkedCardsIds.length === 0}
              onClick={() =>
                GlobalHistory.push(
                  `/home/Contacts-CRM/merge?firstId=${+GetParams(
                    'id'
                  )}&secondId=${checkedCardsIds[0]}&userTypeId=${checkedCards[0].userTypeId
                  }`
                )}
            >
              {t(`${translationPath}merge`)}
            </ButtonBase>
          </div>
          <ViewTypes
            onTypeChanged={onTypeChanged}
            initialActiveType={ViewTypesEnum.tableView.key}
            activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
          />
        </div>
      </div>
      <DuplicatesContactsComponenets
        filter={filter}
        setFilter={setFilter}
        activeCard={activeCard}
        setActiveTab={setActiveTab}
        checkedCards={checkedCards}
        setActiveCard={setActiveCard}
        setCheckedCards={setCheckedCards}
        checkedCardsIds={checkedCardsIds}
        translationPath={translationPath}
        reloadData={getAllDuplicateContact}
        activeActionType={activeActionType}
        duplicatesContacts={duplicatesContacts}
        setCheckedCardsIds={setCheckedCardsIds}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};
DuplicatesContactsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
