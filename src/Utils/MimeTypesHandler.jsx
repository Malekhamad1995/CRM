import ico from '../assets/images/upload-icons/ico.svg';
import png from '../assets/images/upload-icons/png.svg';
import jpg from '../assets/images/upload-icons/jpg.svg';
import gif from '../assets/images/upload-icons/gif.svg';
import svg from '../assets/images/upload-icons/svg.svg';
import unknown from '../assets/images/upload-icons/unknown.svg';
import tif from '../assets/images/upload-icons/tif.svg';
import bmp from '../assets/images/upload-icons/bmp.svg';
import xls from '../assets/images/upload-icons/xls.svg';
import xlsx from '../assets/images/upload-icons/xlsx.svg';

export const getMimeTypeHandler = (fileName) => {
  const fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
  if (fileType === 'ico') {
    return {
      image: ico,
      isFile: false,
      isImage: true,
    };
  }
  if (fileType === 'gif') {
    return {
      image: gif,
      isFile: false,
      isImage: true,
    };
  }
  if (fileType === 'png' || fileType === 'webp') {
    return {
      image: png,
      isFile: false,
      isImage: true,
    };
  }
  if (fileType === 'jpg' || fileType === 'jpeg') {
    return {
      image: jpg,
      isFile: false,
      isImage: true,
    };
  }
  if (fileType === 'svg') {
    return {
      image: svg,
      isFile: false,
      isImage: true,
    };
  }
  if (fileType === 'tif') {
    return {
      image: tif,
      isFile: false,
      isImage: true,
    };
  }
  if (fileType === 'bmp') {
    return {
      image: bmp,
      isFile: false,
      isImage: true,
    };
  }
  if (fileType === 'xlsx') {
    return {
      image: xlsx,
      isFile: true,
      isImage: false,
    };
  }
  if (fileType === 'xls') {
    return {
      image: xls,
      isFile: true,
      isImage: false,
    };
  }
  return {
    image: unknown,
    isFile: true,
    isImage: false,
  };
};
