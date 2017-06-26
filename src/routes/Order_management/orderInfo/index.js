/**
 * Created by Yurek on 2017/5/17.
 */
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../config'

export default (store) => ({
  path : 'order_management/orderInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const OrderInfo = require('./containers/orderInfo').default
      const reducer = require('./module/orderInfo').default
      injectReducer(store, { key: 'orderInfo', reducer });
      cb(null, OrderInfo)
    }, 'orderInfo')
  }
})
