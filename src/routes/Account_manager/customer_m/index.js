
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {CustomerManagementPage} from './containers/Customer_man_page'

export default (store) => ({
  path : rootPath.customer_management,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CustomerManagementPage = require('./containers/Customer_man_page').default;
      const reducer = require('./module/customerManagement').default
      injectReducer(store, { key: 'customerManagement', reducer })
      cb(null, CustomerManagementPage)
    }, 'CustomerManagementPage')
  },


})

