import React, { useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import './ViewCheckBox.scss';

const ViewCheckBox = (props) => {
  const [, setRerender] = React.useState(true);
  const [isDisabled, setIsDisabled] = React.useState(false);

  useEffect(() => {
    const viewPath = window.location.pathname.split('/').slice().pop();
    if (viewPath.toUpperCase() === 'VIEW')
      setIsDisabled(true);
  }, []);

  const handleCheckChange = () => {
    if (
      Array.isArray(props.checkedList[props.currentPageId])
      && props.checkedList[props.currentPageId].find((e) => e === props.lable)
    ) {
      props.checkedList[props.currentPageId].splice(
        props.checkedList[props.currentPageId].findIndex(
          (e) => e === props.lable
        ),
        1
      );
    } else if (props.checkedList[props.currentPageId])
        props.checkedList[props.currentPageId].push(props.lable);
       else props.checkedList[props.currentPageId] = [props.lable];
    props.superList[props.currentPageId] = props.checkedList[props.currentPageId];
    setRerender(false);
    setTimeout(() => {
      setRerender(true);
    }, 300);
  };

  const handleChecked = !!(Array.isArray(props.checkedList[props.currentPageId])
    && props.checkedList[props.currentPageId].find((f) => f === props.lable));

  return (
    <div className="ViewCheckBox">
      <FormControlLabel
        className="form-control-label checkboxColor"
        control={(
          <Checkbox
            className="checkbox-wrapper theme-readonly"
            checkedIcon={<span className="mdi mdi-check" />}
            indeterminateIcon={<span className="mdi mdi-minus" />}
            disabled={isDisabled}
            checked={handleChecked}
            onChange={handleCheckChange}
          />
        )}
        label={props.lable}
      />
    </div>
  );
};
export { ViewCheckBox };
