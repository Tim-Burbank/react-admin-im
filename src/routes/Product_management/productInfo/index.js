
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../config'

export default (store) => ({
  path : 'product_management/productInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CustomerInfo = require('./container/productInfo').default
      const reducer = require('./module/productInfo').default
      injectReducer(store, { key: 'productInfo', reducer });
      cb(null, CustomerInfo)
    }, 'productInfo')
  }
})
