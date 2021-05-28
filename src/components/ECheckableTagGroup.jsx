import React from 'react';
import ECheckableTag from 'Components/ECheckableTag';
import propTypes from 'prop-types';

import styles from './ECheckableTagGroup.less';

class ECheckableTagGroup extends React.Component {
  state = {
    currentList: this.props.initial
  };

  toggleTag = (tag) => {
    const { currentList } = this.state;
    const { mode } = this.props;
    const tagIndex = currentList.findIndex(item => item === tag.value);
    let newList = [...currentList];
    if (mode === 'multiple') {
      if (tagIndex === -1) {
        newList.push(tag.value);
      } else {
        newList.splice(tagIndex, 1);
      }
    } else if (mode === 'single') {
      if (tagIndex === -1) {
        newList = tag.value;
      }
    }
    this.setState({
      currentList: newList
    });
    return newList;
  };

  render() {
    const {
      size, disabled, prefixCls, onChange, options, gap
    } = this.props;
    const { currentList } = this.state;
    let children = null;
    if (options && options.length > 0) {
      children = options.map(option => (
        <ECheckableTag
          key={option.value.toString()}
          disabled={'disabled' in option ? option.disabled : disabled}
          size={'size' in option ? option.size : size}
          value={option.value}
          checked={currentList.includes(option.value)}
          onChange={() => onChange(this.toggleTag(option))}
          style={{ marginRight: gap }}
        >
          <span>{option.text}</span>
        </ECheckableTag>
      ));
    }
    return <div className={styles[prefixCls]}>{children}</div>;
  }
}
// const ECheckableTagGroup = ({
//   size,
//   disabled,
//   prefixCls,
//   onChange,
//   options,
//   gap,
//   initial,
//   mode
//   // selectedList
// }) => {
//   let currentList = initial;
//   const toggleTag = (tag) => {
//     const tagIndex = currentList.findIndex(item => item === tag.value);
//     if (mode === 'multiple') {
//       if (tagIndex === -1) {
//         currentList.push(tag.value);
//       } else {
//         currentList.splice(tagIndex, 1);
//       }
//     } else if (mode === 'single') {
//       if (tagIndex === -1) {
//         currentList = [tag.value];
//       }
//     }
//     return currentList;
//   };
//   let children = null;
//   if (options && options.length > 0) {
//     children = options.map(option => (
//       <ECheckableTag
//         key={option.value.toString()}
//         disabled={'disabled' in option ? option.disabled : disabled}
//         size={'size' in option ? option.size : size}
//         value={option.value}
//         checked={currentList.includes(option.value)}
//         onChange={() => onChange(toggleTag(option))}
//         style={{ marginRight: gap }}
//       >
//         <span>{option.text}</span>
//       </ECheckableTag>
//     ));
//   }
//   return <div className={styles[prefixCls]}>{children}</div>;
// };

ECheckableTagGroup.propTypes = {
  prefixCls: propTypes.string,
  gap: propTypes.number,
  options: propTypes.isRequired,
  size: propTypes.string,
  disabled: propTypes.bool,
  onChange: propTypes.func,
  initial: propTypes.arrayOf(
    propTypes.oneOfType([propTypes.string, propTypes.number])
  ),
  // selectedList: propTypes.arrayOf(
  //   propTypes.oneOfType([propTypes.string, propTypes.number])
  // ),
  mode: propTypes.oneOf(['multiple', 'single'])
};

ECheckableTagGroup.defaultProps = {
  prefixCls: 'EMR-checkabletag-group',
  gap: 15,
  size: 'default',
  disabled: false,
  initial: [],
  // selectedList: [],
  onChange: () => {},
  mode: 'multiple'
};

export default ECheckableTagGroup;
