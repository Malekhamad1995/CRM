import React, { useState } from "react";
import classNames from "classnames";
import { Grid, Tooltip, IconButton, LinearProgress } from "@material-ui/core";
import Map from "pigeon-maps";
import Marker from "pigeon-marker";
import { Edit, PictureAsPdf, Cancel, Save } from "@material-ui/icons";
import ConvertJson from "../../../common/ConvertJson";

const DataRow = ({
  item,
  index,
  updateItemFunction,
  setData,
  itemList,
  itemIndex,
  itemValue,
  itemsValue,
  update,
  setisEditing,
}) => {
  const extractValue = (data) => {
    if (!data) return "N/A";
    if (typeof data === "array" || data instanceof Array)
      return data.toString();
    if (typeof data === "objet" || data instanceof Object) {
      if (data.name) return data.name;
      if (data.latitude && data.longitude) {
        return (
          <Map
            center={[data.latitude, data.longitude]}
            zoom={12}
            style={{ width: "100%" }}
            height={320}
          >
            <Marker anchor={[data.latitude, data.longitude]} payload="1" />
          </Map>
        );
      }
      if (data.selected) {
        return data.selected.map((item) => {
          if (data[item] && Array.isArray(data[item])) {
            return (
              <Grid
                container
                spacing={3}
                justify="center"
                alignItems="center"
                className="dfmDetailsItem"
              >
                {data[item].map((file, index) => (
                  <Grid container item xs={12} spacing={1} index={index}>
                    <Grid item xs={2}>
                      <PictureAsPdf />
                    </Grid>
                    <Grid item xs={10}>
                      {file.fileName}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            );
          }
          return "";
        });
      }
      let toReturn = "";
      Object.keys(data).forEach((key) => {
        toReturn += `${key}: ${data[key]}` + "\n";
      });
      return toReturn;
    }
    if (data.toUpperCase() === "NULL" || data.toUpperCase() === "UNDEFINED")
      return "N/A";
    return `${data}`;
  };
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handelIsEditingClick = async (status) => {
    if (status) {
      setLoading(true);
      try {
        await updateItemFunction();
        setLoading(false);
        setisEditing(false);
        update();
      } catch (e) {
        setLoading(false);
        setError(e.message || `${e}`);
      }
    } else setisEditing(status);
  };
  return (
    <>
      {item && item.data && extractValue(item.data.valueToEdit) !== "N/A" && (
        <>
          <Grid item xs={2}>
            <p className={"font-weight-bold"}>
              {item &&
                item.data &&
                item.data.title.replace("*", "").replace("_", "")}{" "}
              :
            </p>
          </Grid>
          <Grid item xs={4} style={{ whiteSpace: "pre-line" }}>
            {extractValue(item && item.data.valueToEdit)}
          </Grid>
        </>
      )}
    </> // <div
    //   className={classNames({
    //     dataRow: true,
    //     dfmDetailsItem: !((item.data && item.data.valueToEdit && item.data.valueToEdit.latitude)
    //         || (item.data && item.data.valueToEdit && item.data.valueToEdit.selected)
    //     || item.isEditing),
    //   })}
    //   index={index}
    // >
    //
    //
    //
    //
    //
    // </div>
  );
};
export default DataRow;
