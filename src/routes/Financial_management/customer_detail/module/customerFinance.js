
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCH_CUSTOMER_FINANCE= 'FETCH_CUSTOMER_FINANCE';


export const fetchCustomerFinance = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/financial/1','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_CUSTOMER_FINANCE,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}







const ACTION_HANDLERS = {
  [FETCH_CUSTOMER_FINANCE]    : (state, action) => state.update('customerFinance',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function customerFinanceReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
