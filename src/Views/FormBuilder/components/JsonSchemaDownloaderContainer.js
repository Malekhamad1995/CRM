import { connect } from "react-redux";

import JsonSchemaDownloader from "./JsonSchemaDownloader";


function mapStateToProps(state) {
  return {
    schema: state.form.schema,
    uiSchema: state.form.uiSchema
  };
}

export default connect(
  mapStateToProps,
)(JsonSchemaDownloader);
