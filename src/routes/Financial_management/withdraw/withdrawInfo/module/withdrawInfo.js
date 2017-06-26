/**
 * Created by Yurek on 2017/5/17.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const FETCH_WITHDRAWINFO = 'FETCH_WITHDRAWINFO';
export const COMPLETE_WITHDRAW = 'COMPLETE_WITHDRAW';
export const REFUSED_WITHDRAW = 'REFUSED_WITHDRAW'



export const fetchWithdrawInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/transaction-records/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_WITHDRAWINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
};

export const completeWithdrawInfo = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/host2hostBankTransfer/'+id,'put',json)
      .then(
        e=>{
          return dispatch({
            type    : COMPLETE_WITHDRAW,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))
  }
};

export const refusedWithdrawInfo = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/transaction-records/'+id,'put',json)
      .then(
        e=>{
          return dispatch({
            type    : COMPLETE_WITHDRAW,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))
  }
};



const ACTION_HANDLERS = {
  [FETCH_WITHDRAWINFO]    : (state, action) => state.update('withdrawInfo',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function withdrawInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
