
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCH_ROLE = 'FETCH_ROLE';



export const fetchRole = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/rbac/roles','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_ROLE,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const updateRole = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/rbac/roles','put',json)
      .then(e=>{
        if(type==1){
          return dispatch(fetchRole(option))
        }
      })
      .catch(e=>({error:e}))

  }
}

export const deleteRole = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/rbac/roles','delete',json)
      .then(e=>{
        if(type==1){
          return dispatch(fetchRole(option))
        }
      })
      .catch(e=>({error:e}))

  }
}



const ACTION_HANDLERS = {
  [FETCH_ROLE]    : (state, action) => state.update('role',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function roleReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
