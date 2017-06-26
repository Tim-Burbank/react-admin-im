import Immutable from 'immutable'
import {easyFetchWithCache} from '../../../utils/FetchHelper'
import {host} from 'config'
export const USER_LOGGED_IN = 'USER_LOGGED_IN'
// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

export const login = (params) => {
  return (dispatch, getState) => {
    return easyFetchWithCache(host,'/account/login','put',params,null,true,'json')
      .then(e=>
        dispatch({
          type:USER_LOGGED_IN,
          payload:e
        })
      )
      .catch(error =>({error:error}))
  }
}


const ACTION_HANDLERS = {
  [USER_LOGGED_IN]    : (state, action) => state.update('userInfo',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function userInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
