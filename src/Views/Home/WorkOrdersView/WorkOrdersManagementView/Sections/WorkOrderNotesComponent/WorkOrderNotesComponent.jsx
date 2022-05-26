import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../Components';
import { getErrorByName } from '../../../../../../Helper';

export const WorkOrderNotesComponent = ({
  state,
  onStateChanged,
  schema,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const [notes, setNotes] = useState(state.note || '');
  const searchTimer = useRef(null);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='work-order-notes-wrapper childs-wrapper'>
      <div className='work-order-notes-header'>
        <span className='mdi mdi-note-multiple-outline notes-icon mdi-36px' />
        <span className='title-text'>{t(`${translationPath}notes`)}</span>
      </div>
      <div className='work-order-notes-body'>
        <Inputs
          idRef='noteRef'
          labelValue='notes-description'
          value={notes}
          helperText={getErrorByName(schema, 'note').message}
          error={getErrorByName(schema, 'note').error}
          isWithError
          isSubmitted={isSubmitted}
          multiline
          rows={6}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputBlur={(event) => {
            if (searchTimer.current) {
              clearTimeout(searchTimer.current);
              onStateChanged({ id: 'note', value: event.target.value });
            }
          }}
          onInputChanged={(event) => {
            setNotes(event.target.value);
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              onStateChanged({ id: 'note', value: notes });
            }, 700);
          }}
        />
      </div>
    </div>
  );
};

WorkOrderNotesComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
