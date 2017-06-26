/**
 * Created by Yurek on 2017/5/17.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCH_ORDERINFO = 'FETCH_ORDERINFO';
export const CANCEL_ORDER = 'CANCEL_ORDER'

export const fetchOrderInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/orders/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_ORDERINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const cancelOrder = (id) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/cancelorder/'+id,'put')
      .then(
        e=>{
          return dispatch({
            type    : CANCEL_ORDER,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}



const ACTION_HANDLERS = {
  [FETCH_ORDERINFO]    : (state, action) => state.update('orderInfo',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function orderReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
