import React from 'react'; // useRef, useEffect, useCallback   useState,
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../Components';

export const NotesComponent = ({
  parentTranslationPath,
  translationPath,
  setnotes,
  notes,
}) => (
  <div>
    <Inputs
      idRef='problemsOrRemarksRef'
      labelValue='Notes'
      isWithError
      multiline
      value={notes}
      rows={7}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onInputChanged={(event) => {
        setnotes(event.target.value);
      }}
    />
  </div>
);
NotesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setnotes: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,

};
