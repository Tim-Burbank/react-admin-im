
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../config'
import {ProductManagementPage} from './containers/Product_man_page'


export default (store) => ({
  path : rootPath.product_management,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const ProductManagementPage = require('./containers/Product_man_page').default;
      const reducer = require('./module/productManagement').default
      injectReducer(store, { key: 'productManagement', reducer })
      cb(null, ProductManagementPage)
    }, 'ProductManagementPage')
  },
})

