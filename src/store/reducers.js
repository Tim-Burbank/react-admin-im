import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'
import localReducer from './locale'
import userReducer from './user'
import userInfoReducer from '../routes/Login/modules/login'
import craftsmanAccountReducer from '../routes/Account_manager/craftsman_m/module/craftsmanManagement'
import supplierAccountReducer from '../routes/Account_manager/Supplier_m/module/supplierManagement'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    routing: routerReducer,
    locale:localReducer,
    user:userReducer,
    uerInfo:userInfoReducer,
    craftsmanManagement:craftsmanAccountReducer,
    supplierManagement:supplierAccountReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
