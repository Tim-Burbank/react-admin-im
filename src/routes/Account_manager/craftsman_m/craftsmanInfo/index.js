/**
 * Created by Yurek on 2017/5/17.
 */
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../../config'

export default (store) => ({
  path : 'craftsman_management/craftsmanInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SupplierInfo = require('./containers/craftsmanInfo').default
      const reducer = require('./modules/craftsmanInfo').default
      injectReducer(store, { key: 'craftsmanInfo', reducer });
      cb(null, SupplierInfo)
    }, 'craftsmanInfo')
  }
})
