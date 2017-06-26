/**
 * Created by Yurek on 2017/5/17.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const FETCH_ROLEINFO = 'FETCH_ROLEINFO';
export const NEW_ROLEINFO = 'NEW_ROLEINFO';
export const UPDATE_ROLEINFO = 'UPDATE_ROLEINFO'

export const fetchRoleInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/rbac/roles/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_ROLEINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const newRoleInfo = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/rbac/roles','post',json)
      .then(
        e=>{
          return dispatch({
            type    : NEW_ROLEINFO,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}




const ACTION_HANDLERS = {
  [FETCH_ROLEINFO]    : (state, action) => state.update('roleInfo',() =>Immutable.fromJS(action.payload)),
  [NEW_ROLEINFO]    : (state, action) => state.update('newRole',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function roleInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
