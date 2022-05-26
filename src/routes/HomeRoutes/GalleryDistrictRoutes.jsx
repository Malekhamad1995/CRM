import { GalleryDistrictView } from '../../Views/Home/ImagesGallery/GalleryDistrictView/GalleryDistrictView';

export const GalleryDistrictRoutes = [
  {
    path: '/view',
    name: 'ImagesGalleryGroup:district-gallery',
    component: GalleryDistrictView,
    layout: '/home/district-gallery',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ImagesGalleryGroup:district-gallery',
        isDisabled: true,
        route: '/home/district-gallery/view',
        groupName: 'images-gallery',
      },
    ],
  },
];
