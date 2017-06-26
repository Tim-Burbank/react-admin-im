
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCH_SUPPLIER_FINANCE= 'FETCH_SUPPLIER_FINANCE';


export const fetchSupplierFinance = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/financial/2','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_SUPPLIER_FINANCE,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}







const ACTION_HANDLERS = {
  [FETCH_SUPPLIER_FINANCE]    : (state, action) => state.update('supplierFinance',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function supplierFinanceReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
