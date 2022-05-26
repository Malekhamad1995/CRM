// import PlatinumImg from '../assets/images/user-account-types/curve-platinum.svg';
import SilverImg from '../assets/images/user-account-types/curve-silver.svg';
import GoldImg from '../assets/images/user-account-types/curve-gold.svg';
// import PlatinumTableImg from '../assets/images/user-account-types/platinum-donut.png';
import SilverTableImg from '../assets/images/user-account-types/silver-donut.png';
import GoldTableImg from '../assets/images/user-account-types/gold-donut.png';

export const UserAccountTypeEnum = {
  normal: {
    value: 'normal',
    curvedImg: null,
  },
  platinum: {
    value: 'silver',
    curvedImg: SilverImg,
    tableImg: SilverTableImg,
  },
  silver: {
    value: 'silver',
    curvedImg: SilverImg,
    tableImg: SilverTableImg,
  },
  gold: {
    value: 'gold',
    curvedImg: GoldImg,
    tableImg: GoldTableImg,
  },
};
