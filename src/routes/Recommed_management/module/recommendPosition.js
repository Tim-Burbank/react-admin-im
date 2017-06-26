/**
 * Created by Yurek on 2017/5/15.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../utils/FetchHelper'
import {host} from '../../../config'

export const FETCH_RECOMMEND = 'FETCH_RECOMMEND';
export const UPDATE_RECOMMEND = 'UPDATE_RECOMMEND'
export const NEW_RECOMMEND = 'NEW_RECOMMEND'
export const DEL_RECOMMEND = 'DEL_RECOMMEND'

export const fetchRecommed = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/recommendations','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_RECOMMEND,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const updateRecommend = (id,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/recommendation/'+id,'put',json)
      .then(
        e=>{
          return dispatch({
            type    : UPDATE_RECOMMEND,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))
  }
}

export const newRecommend = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/recommendations','post',json)
      .then(
        e=>{
          return dispatch({
            type    : NEW_RECOMMEND,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))
  }
}

export const delRecommend = (id) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/recommendations/'+id,'delete')
      .then(
        e=>{
          return dispatch({
            type    : DEL_RECOMMEND,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))
  }
}


const ACTION_HANDLERS = {
  [FETCH_RECOMMEND]    : (state, action) => state.update('recommend',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function recommendReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
