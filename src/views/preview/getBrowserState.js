export function visibilitychange() {
  let hidden;
  let visibilityChange;
  let visible;
  let state;
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
    visible = 'visible';
    state = 'visibilityState';
  } else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden';
    visibilityChange = 'mozvisibilitychange';
    visible = 'mozVisibilityState';
    state = 'mozVisibilityState';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
    visible = 'msVisibilityState';
    state = 'msVisibilityState';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
    visible = 'webkitVisibilityState';
    state = 'webkitVisibilityState';
  }

  return {
    hidden, visible, visibilityChange, state
  };
}
