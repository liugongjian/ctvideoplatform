// 将base64转换为blob
const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// 将blob转换为file
const blobToFile = (theBlob, fileName) => {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};
const dataURLtoFile = (base64Data, imgName) => {
  const blob = dataURLtoBlob(base64Data);
  return blobToFile(blob, imgName);
};

const getTypeFromUrl = (props) => {
  const { location: { pathname } } = props;
  const reg = /^\/intelligentSearch\/([^/]*).*$/;
  const matchRes = reg.exec(pathname);
  if (matchRes && matchRes[1]) {
    return matchRes[1];
  }
  return undefined;
};

const getPlateColor = (plateType) => {
  let color = 'blue';
  switch (plateType) {
    case '蓝牌':
      color = 'blue';
      break;
    case '黄牌':
      color = 'yellow';
      break;
    case '绿牌':
      color = 'green';
      break;
    case '黑牌':
      color = 'black';
      break;
    case '白牌':
      color = 'white';
      break;
    default:
      break;
  }
  return color;
};

export {
  dataURLtoFile,
  getTypeFromUrl,
  getPlateColor
};
