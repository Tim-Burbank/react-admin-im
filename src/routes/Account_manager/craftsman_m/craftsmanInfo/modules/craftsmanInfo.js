
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const FETCH_CRAFTSMANINFO = 'FETCH_CRAFTSMANINFO';
export const NEW_CRAFTSMANINFO = 'NEW_CRAFTSMANINFO'
export const CHANGE_CRAPSSSWORD = 'CHANGE_CRAPSSSWORD'
export const NEW_CRA_ADDRESS = 'NEW_CRA_ADDRESS'
export const MODIFT_ADDRESS = 'MODIFT_ADDRESS'
export const DEL_ADDRESS = 'DEL_ADDRESS'


export const fetchCraftsmanInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/craftsman/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_CRAFTSMANINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const newCraftsmanInfo = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/craftsman','post',json)
      .then(
        e=>{
          return dispatch({
            type    : NEW_CRAFTSMANINFO,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const newCraAddress = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/b/addresses','post',json)
      .then(
        e=>{
          return dispatch({
            type    : NEW_CRA_ADDRESS,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const modifyCraAddress = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/b/addresses/'+id,'put',json)
      .then(
        e=>{
          return dispatch({
            type    : MODIFT_ADDRESS,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const delCraAddress = (id) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/b/addresses/'+id,'delete')
      .then(
        e=>{
          return dispatch({
            type    : DEL_ADDRESS,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const changePassword = (json) => {
  return (dispatch,getState) => {
    return easyfetch(host,'/a/account/craftsman-changepassword','put',json)
      .then(
        e=>{
          return dispatch({
            type    : CHANGE_CRAPSSSWORD,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))
  }
}


const ACTION_HANDLERS = {
  [FETCH_CRAFTSMANINFO]    : (state, action) => state.update('craftsmanInfo',() =>Immutable.fromJS(action.payload)),
  [NEW_CRAFTSMANINFO]    : (state, action) => state.update('newCraftsman',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function customerAccountReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
