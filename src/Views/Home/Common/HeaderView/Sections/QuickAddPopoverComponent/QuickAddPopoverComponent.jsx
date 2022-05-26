import React , { useEffect , useState } from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { QuickAddEnum } from '../../../../../../Enums';

export const QuickAddPopoverComponent = ({
  parentTranslationPath,
  translationPath,
  setDialogSelect,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const quickAddHandler = (key) => () => {
    setDialogSelect(key);
  };

  const [quickAddListWithPermissions, setQuickAddListWithPermissions] = useState([]);
  useEffect(() => {
    const quickAdd = Object.values(QuickAddEnum);
    let userPermissions = localStorage.getItem('session') ;
    if(userPermissions){
    userPermissions = JSON.parse(localStorage.getItem('session')).permissions;
    var res = quickAdd.filter(item1 =>
      userPermissions.some(item2 => (item2.permissionsId === item1.permissionsId)));
      setQuickAddListWithPermissions(res); 
     }
     else {
      setQuickAddListWithPermissions([]); 
     }
  }, []);

  return (
    // <div></div>
    <div className='quick-add-popover-wrapper'>
      {quickAddListWithPermissions &&
        quickAddListWithPermissions.map((item, index) => (
          <div key={`quickAddRef${index + 1}`} className='quick-add-item-wrapper'>
            <ButtonBase
              id={item.id}
              className='btns quick-add-button'
              onClick={quickAddHandler(item.key)}
            >
              <span className={item.icon} />
            </ButtonBase>
            <label htmlFor={item.id} className='quick-add-text'>
              {t(`${translationPath}${item.value}`)}
            </label>
          </div>
        ))}
    </div>
  );
};
QuickAddPopoverComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setDialogSelect: PropTypes.func.isRequired,
};
