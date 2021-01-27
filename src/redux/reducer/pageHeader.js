const defaultState = {
  pageHeaderRoute: [{
    path: '/',
    title: '控制台',
  }]
};

const headerReducer = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_PAGE_HEADER': {
      return {
        ...state,
        pageHeaderRoute: payload, // [ getCurHeader(state, payload) ],
      };
    }
    case 'PUSH_PAGE_HEADER': {
      return {
        ...state,
        pageHeaderRoute: [
          ...state.pageHeaderRoute,
          payload // getCurHeader(state, payload)
        ]
      };
    }
    default: {
      return state;
    }
  }
};

export function setPageHeader(data) {
  return {
    type: 'SET_PAGE_HEADER',
    payload: data,
  };
}

export function pushPageHeader(data) {
  return {
    type: 'PUSH_PAGE_HEADER',
    payload: data,
  };
}
export default headerReducer;
