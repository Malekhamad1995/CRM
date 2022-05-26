import React from "react";
import PropTypes from "prop-types";
import { CheckboxesComponent } from "../../../../../../Components";

export const CheckboxesComponentActivities = ({
  parentTranslationPath,
  translationPath,
  state,
  setStatefollowUpRequired,
  setStateIsForMobile,
  setStatewithReminder,
  setStatewithDateTime,
}) => (
  <>
    <div className="check-box-wraper-ActivitiesType">
      <CheckboxesComponent
        idRef="reSSef"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        label="With-dateTime"
        singleChecked={state.withDateTime}
        themeClass="theme-secondary"
        isDisabled={state.withReminder}
        onSelectedCheckboxClicked={
          !state.withDateTime
            ? () => [setStatewithDateTime(!state.withDateTime)]
            : () => [
                setStatewithReminder(state.withReminder),
                setStatewithDateTime(!state.withDateTime),
              ]
        }
      />
      <CheckboxesComponent
        idRef="reSSef"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        label="With-Reminder"
        singleChecked={state.withReminder}
        themeClass="theme-secondary"
        onSelectedCheckboxClicked={
          !state.withReminder && !state.withDateTime
            ? () => [
                setStatewithReminder(!state.withReminder),
                setStatewithDateTime(!state.withDateTime),
              ]
            : () => [
                setStatewithReminder(!state.withReminder),
                setStatewithDateTime(state.withDateTime),
              ]
        }
      />
    </div>
    <div className="check-box-wraper-ActivitiesType">
      <CheckboxesComponent
        idRef="reSSef"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        label="Followuprequired"
        singleChecked={state.followUpRequired}
        themeClass="theme-secondary"
        onSelectedCheckboxClicked={() => {
          setStatefollowUpRequired(!state.followUpRequired);
        }}
      />
      <CheckboxesComponent
        idRef="reSSef"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        label="IsForMobile"
        singleChecked={state.isForMobile}
        themeClass="theme-secondary"
        onSelectedCheckboxClicked={() => {
          setStateIsForMobile(!state.isForMobile);
        }}
      />
    </div>
  </>
);

CheckboxesComponentActivities.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  setStatefollowUpRequired: PropTypes.func.isRequired,
  setStateIsForMobile: PropTypes.func.isRequired,
  setStatewithDateTime: PropTypes.func.isRequired,
  setStatewithReminder: PropTypes.func.isRequired,
};
