import React from "react"
import Loadable from "react-loadable";
import './style/css/BuilderStyle.css';
import './style/css/bootstrap.min.css';
const  Loading = () => {
  return (
    <i
      className="fa fa-gear fa-spin fadeInOut"
      style={{
        fontSize: '32px',
        opacity: 0.8,
        top: '5rem',
        left: '1rem',
        position: 'absolute',
      }}
    />
  );
};

 const FormEditBuilder =
     Loadable({
    loader: () => import("./components/FormEditContainer"),
    loading: Loading
  });

export  default  FormEditBuilder; 

