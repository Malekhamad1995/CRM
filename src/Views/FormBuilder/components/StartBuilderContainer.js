import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import StartBuilder from "../components/StartBuilder";
import * as FieldListActions from "../actions/Fieldlist";

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(FieldListActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartBuilder);
