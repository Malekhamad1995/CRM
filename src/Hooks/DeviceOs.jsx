import { deviceOs } from '../Enums';

const useDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (/windows phone/i.test(userAgent))
    return deviceOs.windowsPhone;

  if (/android/i.test(userAgent))
    return deviceOs.android;

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    return deviceOs.ios;

  return 'unknown';
};

export { useDevice };
