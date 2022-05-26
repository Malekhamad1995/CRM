import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FormEdit from "./FormEdit";
import * as FieldListActions from "../actions/Fieldlist";
import * as ServerActions from "../actions/Server";


function mapDispatchToProps(dispatch) {
         bindActionCreators(FieldListActions, dispatch);
  return bindActionCreators(ServerActions, dispatch);
}

function mapStateToProps(state) {
  return {};
}

const   EditFormBuilder= connect(
    mapStateToProps,
        mapDispatchToProps
)(FormEdit);
export default EditFormBuilder;