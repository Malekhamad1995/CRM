import { GalleryCommunityView } from "../../Views/Home/ImagesGallery/GalleryCommunityView/GalleryCommunityView";

export const GalleryCommunityRoutes = [
  {
    path: "/view",
    name: "ImagesGalleryGroup:community-gallery",
    component: GalleryCommunityView,
    layout: "/home/community-gallery",
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: "ImagesGalleryGroup:community-gallery",
        isDisabled: true,
        route: "/home/community-gallery/view",
        groupName: "images-gallery",
      },
    ],
  },
];
