
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const FETCH_ADMININFO = 'FETCH_ADMININFO';
export const FETCH_ADMINOPT = 'FETCH_ADMINOPT'
export const CHANGE_ADMINPASSWORD = 'CHANGE_ADMINPASSWORD'


export const fetchAdminInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/admins/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_ADMININFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
};



export const updateAdminInfo = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/admins/'+id,'put',json)
      .then(
        e=>{
          return dispatch(fetchAdminInfo(id,'get'))
        }
      )
      .catch(e=>({error:e}))

  }
};

export const fetchAdminOptInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/operation-history/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_ADMINOPT,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const changePassword = (json) => {
  return (dispatch,getState) => {
    return easyfetch(host,'/a/admins-changepassword','put',json)
      .then(
        e=>{
          return dispatch({
            type    : CHANGE_ADMINPASSWORD,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))
  }
}



const ACTION_HANDLERS = {
  [FETCH_ADMININFO]    : (state, action) => state.update('adminInfo',() =>Immutable.fromJS(action.payload)),
  [FETCH_ADMINOPT]    : (state, action) => state.update('adminOptInfo',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function adminInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
