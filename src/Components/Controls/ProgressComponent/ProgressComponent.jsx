import React from 'react';
import { PropTypes } from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getBgProgressColor } from '../../../Helper';
import { useLocalStorage } from '../../../Hooks';

const ProgressComponet = ({
  value,
  progressText,
  inSameLine,
  isTextColored,
  textClasses,
  wrapperClasses,
  themeClasses,
  progressHidderClasses,
}) => {
  const [language] = useLocalStorage('localization', {
    currentLanguage: 'en',
    isRtl: false,
  });
  return (
    <div
      className={`progresses-wrapper${inSameLine ? ' nowrap' : ''}${` ${wrapperClasses}` || ''}${
        ` ${themeClasses}` || ''
      }`}
    >
      {progressText && (
        <span
          className={`progresses-text ${
            isTextColored && themeClasses !== 'theme-gradient' ?
              getBgProgressColor(value || 0).textColor :
              ''
          } ${textClasses} ${
            themeClasses === 'theme-gradient' && getBgProgressColor(value || 0).className
          }`}
          style={
            (themeClasses === 'theme-gradient' && {
              position: 'absolute',
              left: (!language.isRtl && `${value || 0}%`) || undefined,
              right: (language.isRtl && `${value || 0}%`) || undefined,
              transform: (language.isRtl && 'translateX(50%)') || 'translateX(-50%)',
              bottom: '.25rem',
            }) ||
            undefined
          }
        >
          {progressText}
        </span>
      )}
      <div className='progresses-line-wrapper'>
        <LinearProgress
          className={`progresses ${
            themeClasses !== 'theme-gradient' && getBgProgressColor(value || 0).className
          }`}
          variant='determinate'
          value={value || 0}
        />
        {themeClasses === 'theme-gradient' && (
          <div
            className={`progresses-other-hidder${` ${progressHidderClasses}`}`}
            style={{ width: `${100 - value || 0}%` }}
          />
        )}
      </div>
    </div>
  );
};
ProgressComponet.propTypes = {
  value: PropTypes.number.isRequired,
  progressText: PropTypes.string,
  inSameLine: PropTypes.bool,
  isTextColored: PropTypes.bool,
  textClasses: PropTypes.string,
  wrapperClasses: PropTypes.string,
  themeClasses: PropTypes.string,
  progressHidderClasses: PropTypes.string,
};
ProgressComponet.defaultProps = {
  progressText: null,
  inSameLine: false,
  isTextColored: false,
  textClasses: '',
  wrapperClasses: '',
  themeClasses: '',
  progressHidderClasses: '',
};
export { ProgressComponet };
