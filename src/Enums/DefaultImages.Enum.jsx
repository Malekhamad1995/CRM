import WomanImg from '../assets/images/defaults/woman.svg';
import ManImg from '../assets/images/defaults/man.svg';
import CorporateImg from '../assets/images/defaults/corporate.svg';
import BuildingsImg from '../assets/images/defaults/buildings.png';
import UploadImg from '../assets/images/icons/upload.svg';
import Uploadmark from '../assets/images/icons/upload-icon-mark.png';

export const DefaultImagesEnum = {
  woman: {
    key: 'woman',
    alt: 'shared.defaultImages.female',
    defaultImg: WomanImg,
  },
  man: {
    key: 'man',
    alt: 'shared.defaultImages.male',
    defaultImg: ManImg,
  },
  corporate: {
    key: 'corporate',
    alt: 'shared.defaultImages.corporate',
    defaultImg: CorporateImg,
  },
  individual: {
    key: 'individual',
    alt: 'shared.defaultImages.individual',
    defaultImg: ManImg,
  },
  buildings: {
    key: 'buildings',
    alt: 'shared.defaultImages.building',
    defaultImg: BuildingsImg,
  },
  upload: {
    key: 'upload',
    alt: 'shared.defaultImages.upload',
    defaultImg: UploadImg,
  },
  Uploadmark: {
    key: 'Uploadmark',
    alt: 'shared.defaultImages.upload',
    defaultImg: Uploadmark,
  },
};
