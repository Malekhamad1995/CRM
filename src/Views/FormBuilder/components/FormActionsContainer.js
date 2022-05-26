import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormActions } from './FormActions';
import * as FieldListActions from '../actions/Fieldlist';
import config from '../config/config';

function mapStateToProps(state) {
  return {
    fieldList: config.fieldList,
    schema: state.formbuilder.form.schema,
  };
}

function mapDispatchToProps(dispatch) {
  const actionCreators = { ...FieldListActions };
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FormActions);
