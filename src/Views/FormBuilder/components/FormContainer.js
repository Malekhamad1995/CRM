import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as FieldListActions from "../actions/Fieldlist";
import * as ServerActions from "../actions/Server";
import Form from "./Form";
import EditableField from  "./EditableField";
import TitleField from  "./TitleField";
import DescriptionField from  "./DescriptionField";

function mapStateToProps(state) {
  return {
    error: state.formbuilder.form.error,
    schema: state.formbuilder.form.schema,
    uiSchema: state.formbuilder.form.uiSchema,
    formData: state.formbuilder.form.formData,
    status: state.formbuilder.serverStatus.status,
    dragndropStatus: state.formbuilder.dragndrop.dragndropStatus
  };
}

 function mapDispatchToProps(dispatch) {
  const actionCreators = {...FieldListActions, ...ServerActions};
  const actions = bindActionCreators(actionCreators, dispatch);

  // Side effect: attaching action creators as EditableField props, so they're
  // available from within the Form fields hierarchy.
 
  EditableField.defaultProps = Object.assign(
    {}, EditableField.defaultProps || {}, actions);
     
    TitleField.defaultProps = Object.assign(
    {}, TitleField.defaultProps || {}, actions);
    
    DescriptionField.defaultProps = Object.assign(
    {}, DescriptionField.defaultProps || {}, actions);
   
  return actions;
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    SchemaField: EditableField,
    TitleField,
    DescriptionField,
    onChange: () => {}
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Form);
