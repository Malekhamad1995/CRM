import { GallerySubCommunityView } from '../../Views/Home/ImagesGallery/GallerySubCommunityView/GallerySubCommunityView';

export const GallerySubCommunityRoutes = [
  {
    path: '/view',
    name: 'ImagesGalleryGroup:sub-community-gallery',
    component: GallerySubCommunityView,
    layout: '/home/subCommunity-gallery',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ImagesGalleryGroup:sub-community-gallery',
        isDisabled: true,
        route: '/home/subCommunity-gallery/view',
        groupName: 'images-gallery',
      },
    ],
  },
];
