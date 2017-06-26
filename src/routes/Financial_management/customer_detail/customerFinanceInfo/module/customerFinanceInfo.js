/**
 * Created by Yurek on 2017/5/17.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const FETCH_CUSOMERFINANCEINFO = 'FETCH_CUSOMERFINANCEINFO';
export const FETCH_CUST_TRANS = 'FETCH_CUST_TRANS';
export const UPDATE_CUST_FINANCE = 'UPDATE_CUST_FINANCE';




export const fetchCustomerFinanceInfo = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/financial/1/'+id,'get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_CUSOMERFINANCEINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const fetchCustomerTrans = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/transaction-records','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_CUST_TRANS,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const updateCustomerFinanceInfo = (walletId,id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/financial/1/'+walletId,'put',json)
      .then(
        e=>{
          return dispatch(fetchCustomerFinanceInfo(id))
        }
      )
      .catch(e=>({error:e}))
  }
};



const ACTION_HANDLERS = {
  [FETCH_CUSOMERFINANCEINFO]    : (state, action) => state.update('customerFinanceInfo',() =>Immutable.fromJS(action.payload)),
  [FETCH_CUST_TRANS]    : (state, action) => state.update('customerFinanceTrans',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function customerFinanceInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
