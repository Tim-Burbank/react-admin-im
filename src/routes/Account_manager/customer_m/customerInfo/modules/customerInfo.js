
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'


export const FETCH_CUSTOMERINFO = 'FETCH_CUSTOMERINFO';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD'
export const NEW_CRA_ADDRESS = 'NEW_CRA_ADDRESS'
export const MODIFT_ADDRESS = 'MODIFT_ADDRESS'
export const DEL_ADDRESS = 'DEL_ADDRESS'


export const fetchCustomerInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/customer/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_CUSTOMERINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
};



export const newCustAddress = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/addresses','post',json)
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

export const modifyCustAddress = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/addresses/'+id,'put',json)
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

export const delCustAddress = (id) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/addresses/'+id,'delete')
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
    return easyfetch(host,'/a/account/supplier-changepassword','put',json)
      .then(
        e=>{
          return dispatch({
            type    : CHANGE_PASSWORD,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))
  }
}


const ACTION_HANDLERS = {
  [FETCH_CUSTOMERINFO]    : (state, action) => state.update('customerInfo',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function customerAccountReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
