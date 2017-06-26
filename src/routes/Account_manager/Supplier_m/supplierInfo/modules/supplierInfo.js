/**
 * Created by Yurek on 2017/5/17.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const FETCH_SUPPLIERINFO = 'FETCH_SUPPLIERINFO';
export const NEW_SUPPLIERINFO = 'NEW_SUPPLIERINFO';
export const CHANGE_SUPPASSWORD = 'CHANGE_SUPPASSWORD'

export const fetchSupplierInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/supplier/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_SUPPLIERINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const newSupplierInfo = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/supplier','post',json)
      .then(
        e=>{
          return dispatch({
            type    : NEW_SUPPLIERINFO,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const changePassword = (json) => {
  return (dispatch,getState) => {
    return easyfetch(host,'/a/account/supplier-changepassword','put',json)
      .then(
        e=>{
          return dispatch({
            type    : CHANGE_SUPPASSWORD,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))
  }
}


const ACTION_HANDLERS = {
  [FETCH_SUPPLIERINFO]    : (state, action) => state.update('supplierInfo',() =>Immutable.fromJS(action.payload)),
  [NEW_SUPPLIERINFO]    : (state, action) => state.update('newSupplier',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function supplierAccountReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
