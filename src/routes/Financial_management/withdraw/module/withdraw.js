
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCHWITHDRAW = 'FETCHWITHDRAW';
export const NEWCOUPONS = 'NEWCOUPONS';


export const fetchWithdraw = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/transaction-records','get',{name:2,...json})
      .then(
        e=>{
          return dispatch({
            type    : FETCHWITHDRAW,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}



export const updateWithdraw = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/transaction-records','put',json)
      .then(e=>{
        if(type==1){
          return dispatch(fetchWithdraw(option))
        }
      })
      .catch(e=>({error:e}))

  }
}



const ACTION_HANDLERS = {
  [FETCHWITHDRAW]    : (state, action) => state.update('withdraw',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function withdrawReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
