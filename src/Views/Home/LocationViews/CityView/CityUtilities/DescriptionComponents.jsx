import React, {
  useEffect, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const DescriptionComponents = ({
  parentTranslationPath,
  translationPath,
  setDescription,
  details,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState({
    englishDescription: ''
  });

  useEffect(() => {
    if (details || (state.englishDescription === undefined)) {
      setState({
        englishDescription: details && details.englishDescription
      });
    }
  }, [details, state.englishDescription]);

  useEffect(() => {
    setDescription(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div className='view-wrapper-AddFormCountry'>
      <div className='w-100 px-2 ReactQuill-wrpaer'>
        <div className='pt-3'>
          <span className='label-wrapper'>{t(`${translationPath}English-description`)}</span>
          <ReactQuill
            idRef='englishDescription'
            placeholder={t(`${translationPath}TypeHere`)}
            value={state.englishDescription || ''}
            onChange={(event) =>
              setState({ ...state, englishDescription: event })}
          />
        </div>
      </div>
    </div>

  );
};

DescriptionComponents.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  details: PropTypes.instanceOf(Object).isRequired,
  setDescription: PropTypes.func.isRequired,
};
