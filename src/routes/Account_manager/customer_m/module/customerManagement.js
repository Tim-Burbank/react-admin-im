
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'
import {fetchCustomerInfo} from '../customerInfo/modules/customerInfo'

export const FETCH_CUSTOMER = 'FETCH_CUSTOMER';

export const fetchCustomer = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/customer','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_CUSTOMER,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const updateCustomer = {
  active:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/customer-active','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchCustomer(option))
          }else if(type==2){
            return dispatch(fetchCustomerInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  stop:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/customer-stop','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchCustomer(option))
          }else if(type==2){
            return dispatch(fetchCustomerInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
}


const ACTION_HANDLERS = {
  [FETCH_CUSTOMER]    : (state, action) => state.update('customerAccount',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function customerAccountReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
