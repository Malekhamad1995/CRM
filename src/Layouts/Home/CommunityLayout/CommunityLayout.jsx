import React from "react";
import { SwitchRoute } from "../../../Components/Route/SwitchRoute";
import { GalleryCommunityRoutes } from "../../../routes/HomeRoutes/GalleryCommunityRoutes";

export const GalleryCommunityLayout = () => (
  <SwitchRoute routes={GalleryCommunityRoutes} />
);
