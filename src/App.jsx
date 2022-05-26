// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { GlobalToasterGenerator, Middleware, SetGlobalRerender } from './Helper';
// import { SwitchRoute } from './Components/Route/SwitchRoute';
// import { AppRoutes } from './routes/AppRoutes/AppRoute';
// import { preventSelectAll } from './Helper/PreventSelectAll.Helper';
// // const isRtl = true;
// // document.body.classList = isRtl ? 'rtl' : 'ltr';
// // document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
// const App = () => {
//   const [render, setRender] = useState(false);
//   useEffect(() => {
//      preventSelectAll();
//   }, []);
//   console.log = () => {};
//   console.error = () => {};
//   console.debug = () => {};
//   return (
//     <Router>
//       <GlobalToasterGenerator />
//       <Middleware />
//       {/* <Meddilware /> */}
//       <SwitchRoute routes={AppRoutes} />
//     </Router>

//   );
// };

// export default App;
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
 GlobalToasterGenerator, Middleware, SetGlobalRerender, showWarn
} from './Helper';
import { SwitchRoute } from './Components/Route/SwitchRoute';
import { AppRoutes } from './routes/AppRoutes/AppRoute';
// const isRtl = true;
// document.body.classList = isRtl ? 'rtl' : 'ltr';
// document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

const App = () => {
  const [render, setRender] = useState(false);
  SetGlobalRerender(setRender, render);
  useEffect(() => {
    if (navigator.onLine === false)
    showWarn((' NO internet'));
  }, []);

  return (
    <Router>
      <GlobalToasterGenerator />
      <Middleware />
      {/* <Meddilware /> */}
      <SwitchRoute routes={AppRoutes} />
    </Router>
  );
};

export default App;
