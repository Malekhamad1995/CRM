import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { AutocompleteComponent } from "../../../../../../Components";
import { Status } from "../../../../../../Enums/Status.Enum";

export const StatusComponentComponent = ({
  parentTranslationPath,
  translationPath,
  setstatus,
  status,
  isSubmitted,
  helperText,
  error,
}) => {
  const [selected, setSelected] = useState({});
  const { t } = useTranslation("MaintenanceContracts");

  useEffect(() => {
    setSelected(
      Object.values(Status).findIndex((element) => element.value === status) !==
        -1 &&
        Object.values(Status).find((element) => element.value === status).name
    );
  }, [status]);

  return (
    <div>
      <AutocompleteComponent
        idRef="StatusRef"
        labelValue="Status"
        multiple={false}
        data={Object.values(Status)}
        displayLabel={(option) => t(`${option.name || ""}`)}
        selectedValues={{ name: selected, value: status }}
        getOptionSelected={(option) => option.name === selected}
        inputPlaceholder={t(`${translationPath}Statusselect`)}
        withoutSearchButton
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        t
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setstatus((newValue && +newValue.value) || "");
        }}
      />
    </div>
  );
};
StatusComponentComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setstatus: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
};
