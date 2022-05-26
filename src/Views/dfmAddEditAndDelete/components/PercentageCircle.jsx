import React from 'react';
import './CircularProgress.css';
import CircularProgress from '@material-ui/core/CircularProgress';


const PercentageProgressCircle = ({ dataCompleted = '0%' }) => {
  if (dataCompleted >= '75%') {
    return (
      <div className='root'>

        <CircularProgress
          id='topgreen'
          variant='determinate'
          value={100}
          size={33}
          thickness={4}
        />
        <div className='persateg '>{dataCompleted || '0%'}</div>

        <CircularProgress
          variant='static'
          disableShrink
          id='bottomgreen'
          value={dataCompleted && parseInt(dataCompleted.replace('%', ''))}
          size={33}
          thickness={4}
        />
      </div>
    );
  }

  if (dataCompleted >= '43%' || dataCompleted >= '74%') {
    return (
      <div className='root'>
        <CircularProgress
          id='top'
          variant='determinate'
          value={100}
          size={33}
          thickness={4}
        />
        <div className='persateg '>{dataCompleted || '0%'}</div>
        <CircularProgress
          variant='static'
          disableShrink
          id='bottom'
          value={dataCompleted && parseInt(dataCompleted.replace('%', ''))}
          size={33}
          thickness={4}
        />
      </div>
    );
  }

  if (dataCompleted <= '42%') {
    return (
      <div className='root'>
        <CircularProgress
          id='topred'
          variant='determinate'
          value={100}
          size={33}
          thickness={4}
        />
        <div className='persateg '>{dataCompleted || '0%'}</div>
        <CircularProgress
          variant='static'
          disableShrink
          id='bottomred'
          value={dataCompleted && parseInt(dataCompleted.replace('%', ''))}
          size={33}
          thickness={4}
        />
      </div>
    );
  }
};
export default PercentageProgressCircle;
