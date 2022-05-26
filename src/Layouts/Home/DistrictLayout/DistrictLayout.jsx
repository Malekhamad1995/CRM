import React from "react";
import { SwitchRoute } from "../../../Components/Route/SwitchRoute";
import { GalleryDistrictRoutes } from "../../../routes/HomeRoutes/GalleryDistrictRoutes";

export const GalleryDistrictLayout = () => (
  <SwitchRoute routes={GalleryDistrictRoutes} />
);
