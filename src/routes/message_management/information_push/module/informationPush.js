
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCH_JPUSHS = 'FETCH_JPUSHS';
export const PUSH_INFORMATION = 'PUSH_INFORMATION'
export const GROUP_PUSH = 'GROUP_PUSH'

export const fetchJpushs = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/jpushs','get',{limit:1000,...json})
      .then(
        e=>{
          return dispatch({
            type    : FETCH_JPUSHS,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const pushInfo = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/pushOne','post',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_JPUSHS,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const groupPushInfo = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/pushByTypeAndTag','post',json)
      .then(
        e=>{
          return dispatch({
            type    : GROUP_PUSH,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

const ACTION_HANDLERS = {
  [FETCH_JPUSHS]    : (state, action) => state.update('informationPush',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function jpushsReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
