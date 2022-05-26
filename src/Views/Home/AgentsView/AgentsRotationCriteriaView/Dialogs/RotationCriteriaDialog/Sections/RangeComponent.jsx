import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../Components';

export const RangeComponent = ({
  parentTranslationPath,
  translationPath,
  state,
  idRef,
  labelValue,
  agentRotationRangeType,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [rangeState, setRangeState] = useState({
    startValue: 0,
    endValue: 0,
    agentRotationRangeTypeId: agentRotationRangeType
  });

  const [timerStartValue, setTimerStartValue] = useState(null);
  const [timerEndValue, setTimerEndValue] = useState(null);

  useEffect(() => {
    const updatedState = state.rotationSchemeRanges.find((f) => f.agentRotationRangeTypeId === rangeState.agentRotationRangeTypeId);
    if (updatedState)
      setRangeState(updatedState);
  }, [state]);


  return (
    <>
      <div className='dialog-content-item'>
        <div className='reminder-wrapper'>
          <div className='input-range'>
            <Inputs
              idRef={idRef}
              labelValue={labelValue}
              value={rangeState.startValue || 0}
              // type="number"
              // min={0}
              onInputChanged={(e) => {
                if (isNaN(e.target.value))
                  return;

                const value = +(+e.target.value * 1).toFixed(0);
                setRangeState({ ...rangeState, startValue: value });
              }}
              onKeyUp={() => {
                setTimerStartValue(setTimeout(() => {
                  let change = {};
                  if (rangeState.startValue < rangeState.endValue) {
                    change = { ...rangeState };
                    setRangeState(change);
                  } else {
                    change = { ...rangeState, endValue: rangeState.startValue };
                    setRangeState(change);
                  }

                  const updatedState = state.rotationSchemeRanges.findIndex((f) => f.agentRotationRangeTypeId === rangeState.agentRotationRangeTypeId);
                  if (updatedState !== -1)
                    state.rotationSchemeRanges[updatedState] = change;
                   else
                    state.rotationSchemeRanges.push(change);
                }, 1000));
              }}
              onKeyDown={() => {
                if (timerStartValue != null) clearTimeout(timerStartValue);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>


          <div className='section-to'>
            <span>{t(`${translationPath}to`)}</span>
          </div>
          <div className='input-range'>
            <Inputs
              idRef='priceRangeToIdRef'
              value={rangeState.endValue || 0}
              // type="number"
              // min={0}
              onInputChanged={(e) => {
                if (isNaN(e.target.value))
                  return;

                const value = +(+e.target.value * 1).toFixed(0);
                setRangeState({ ...rangeState, endValue: value });
              }}
              onKeyUp={() => {
                setTimerEndValue(setTimeout(() => {
                  let change = {};
                  if (rangeState.endValue > rangeState.startValue) {
                    change = { ...rangeState };
                    setRangeState(change);
                  } else {
                    change = { ...rangeState, startValue: rangeState.endValue };
                    setRangeState(change);
                  }

                  const updatedState = state.rotationSchemeRanges.findIndex((f) => f.agentRotationRangeTypeId === rangeState.agentRotationRangeTypeId);
                  if (updatedState !== -1)
                    state.rotationSchemeRanges[updatedState] = change;
                   else
                    state.rotationSchemeRanges.push(change);
                }, 1000));
              }}
              onKeyDown={() => {
                if (timerEndValue != null) clearTimeout(timerEndValue);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        </div>
      </div>
    </>
  );
};
