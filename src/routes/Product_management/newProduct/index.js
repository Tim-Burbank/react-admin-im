
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../config'

export default (store) => ({
  path : 'product_management/new_product',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const ProductNew = require('./component/productNew').default
      const reducer = require('./module/productNew').default
      injectReducer(store, { key: 'productInfo', reducer });
      cb(null, ProductNew)
    }, 'ProductNew')
  }
})
