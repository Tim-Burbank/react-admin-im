
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../config'
import {SupplierManagementPage} from './containers/Order_man_page'


export default (store) => ({
  path : rootPath.order_management,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const OrderManagementPage = require('./containers/Order_man_page').default;
      const reducer = require('./module/orderManagement').default
      injectReducer(store, { key: 'orderManagement', reducer })
      cb(null, OrderManagementPage)
    }, 'OrderManagementPage')
  },
})

