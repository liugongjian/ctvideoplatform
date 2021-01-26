import moment from 'moment';

const getInitRangeDate = (range) => {
  if (!range || !range.length) {
    return '';
  }
  const patten = 'YYYY-MM-DD';
  const date = range.split(',');
  if (date.length === 2) {
    return date.map(item => moment(item, patten));
  }
  return '';
};

export default getInitRangeDate;
