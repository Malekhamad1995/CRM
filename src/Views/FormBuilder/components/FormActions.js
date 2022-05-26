import React from 'react';
import { Button, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import FieldListDropdown from './FieldListDropdown';

function FormActions(props) {
  const onClick = (event) => {
    props.publishForm(({ collection, adminToken }) => {
      props.history.pushState(null, `/builder/published/${adminToken}`);
    });
  };

  let saveIconName;
  if (props.status === 'pending')
    saveIconName = 'refresh spin';
   else
    saveIconName = 'save';

  return (
    <div>
      <fieldset className='builder-inner-actions'>
        <ButtonToolbar className='builder-inner-actions'>
          <FieldListDropdown className='pull-right' {...props}>
            <i className='glyphicon glyphicon-plus' />
            Add a field
          </FieldListDropdown>
        </ButtonToolbar>
        <ButtonGroup className='pull-right'>
          <Button
            onClick={() =>
                window.confirm('This action will reset all unsaved changes, Are you sure?') &&
                props.resetForm(() => {
                  props.history.go(0);
                })}
          >
            <i className='glyphicon glyphicon-remove' />
            Reset
            {' '}
            <span className='hidden-xs'>form</span>
          </Button>
          <Button bsStyle='success' onClick={onClick}>
            <i className={`glyphicon glyphicon-${saveIconName}`} />
            Save your form
          </Button>
        </ButtonGroup>
      </fieldset>
    </div>
  );
}

const mapStateToProps = (state) => {
  const {
    login: { loginResponse },
  } = state;
  return {
    loginResponse,
  };
};
const view = connect(mapStateToProps)(FormActions);
export { view as FormActions };
