
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCH_COUPONINFO = 'FETCH_COUPONINFO';



export const fetchCouponInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/voucher/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_COUPONINFO,
            payload : e.obj
          })
        }
      )
      .catch(e=>({error:e}))

  }
};


export const updateCouponInfo = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/voucher/'+id,'put',json)
      .then(
        e=>{
          return dispatch(fetchCouponInfo(id,'get'))
        }
      )
      .catch(e=>({error:e}))

  }
};



const ACTION_HANDLERS = {
  [FETCH_COUPONINFO]    : (state, action) => state.update('couponInfo',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function couponInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
