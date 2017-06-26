
import Immutable from 'immutable'
import {easyfetch} from '../../../utils/FetchHelper'
import {host} from '../../../config'

export const FETCHCOUPONS = 'FTCHCOUPONS';
export const NEWCOUPONS = 'NEWCOUPONS';


export const fetchCoupons = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/vouchers','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCHCOUPONS,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const newCoupons = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/vouchers','post',json)
      .then(e=>{
        if(type==1){
          return dispatch(fetchCoupons(option))
        }
      })
      .catch(e=>({error:e}))

  }
}

export const updateCoupons = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/vouchers/bench','put',json)
      .then(e=>{
        if(type==1){
          return dispatch(fetchCoupons(option))
        }
      })
      .catch(e=>({error:e}))

  }
}



const ACTION_HANDLERS = {
  [FETCHCOUPONS]    : (state, action) => state.update('couponsManagement',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function couponsReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
