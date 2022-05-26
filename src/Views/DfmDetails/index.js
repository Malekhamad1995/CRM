import React from 'react';
import Tabs from '../../components/dfmDetails/Tabs';
import { details } from '../../config/dfmDetails';

const DetailsMainPage = ({ match: { params: { pageName, type, uid } } }) => {
  const selectedPage = details[pageName];
  return (
    <div  className={"tabs"} >
      { selectedPage && uid && (
      <Tabs
        uid={uid}
        selectedPage={selectedPage}
        type={type}
      />
      )}
    </div>
  );
};
export default DetailsMainPage;
