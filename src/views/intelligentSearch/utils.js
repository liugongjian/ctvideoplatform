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

export {
  dataURLtoFile,
  getTypeFromUrl
};
