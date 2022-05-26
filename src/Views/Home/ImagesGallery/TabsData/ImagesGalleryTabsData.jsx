import { ImagesGalleryAlbumsComponent, ImagesGalleryPhotosComponent } from '../Sections';
import { ImageGalleryPermissions } from '../../../../Permissions';

export const ImagesGalleryTabsData = [
  {
    label: 'albums',
    component: ImagesGalleryAlbumsComponent,
    permissionsList: Object.values(ImageGalleryPermissions),
    permissionsId: ImageGalleryPermissions.ViewAndFilterOnAlbumImages.permissionsId,
  },

  {
    label: 'photos',
    component: ImagesGalleryPhotosComponent,
    permissionsList: Object.values(ImageGalleryPermissions),
    permissionsId: ImageGalleryPermissions.ViewAndSearchImagesGallery.permissionsId,
  },

];
