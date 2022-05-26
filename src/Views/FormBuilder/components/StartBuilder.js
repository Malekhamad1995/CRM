import React from "react";
import Container from "../../../common/Container"

export default function StartBuilder(props) {
  const createNewForm = () => {
    //  props.history.push("/formbuilder/Builder");--> New Form
      props.history.push("/FormEdit"); // --> Exist Form
  };

  return (
    <Container history={History}>
      <div className="jumbotron">
        <div className="container">
        <p>{createNewForm()}</p>
        </div>
      </div>
     </Container>
  );
}
