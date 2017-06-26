
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../../config'

export default (store) => ({
  path : 'customer_management/customerInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CustomerInfo = require('./containers/customerInfo').default
      const reducer = require('./modules/customerInfo').default
      injectReducer(store, { key: 'customerInfo', reducer });
      cb(null, CustomerInfo)
    }, 'customerInfo')
  }
})
