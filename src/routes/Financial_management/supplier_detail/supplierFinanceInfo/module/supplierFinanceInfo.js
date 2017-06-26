/**
 * Created by Yurek on 2017/5/17.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const FETCH_SUPPLIERFINANCEINFO = 'FETCH_SUPPLIERFINANCEINFO';
export const FETCH_SUP_TRANS = 'FETCH_SUP_TRANS';
export const UPDATE_CUST_FINANCE = 'UPDATE_CUST_FINANCE';




export const fetchSupplierFinanceInfo = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/financial/2/'+id,'get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_SUPPLIERFINANCEINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const fetchSupplierTrans = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/transaction-records','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_SUP_TRANS,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const updateSupplierFinanceInfo = (walletId,id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/financial/2/'+walletId,'put',json)
      .then(
        e=>{
          return dispatch(fetchSupplierFinanceInfo(id))
        }
      )
      .catch(e=>({error:e}))
  }
};



const ACTION_HANDLERS = {
  [FETCH_SUPPLIERFINANCEINFO]    : (state, action) => state.update('supplierFinanceInfo',() =>Immutable.fromJS(action.payload)),
  [FETCH_SUP_TRANS]    : (state, action) => state.update('supplierFinanceTrans',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function supplierFinanceInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
