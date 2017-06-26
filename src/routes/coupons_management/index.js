
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../config'


export default (store) => ({
  path : rootPath.coupons_management,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CouponsManagementPage = require('./component/Coupons_man_page').default;
      const reducer = require('./module/couponsManagement').default
      injectReducer(store, { key: 'couponsManagement', reducer })
      cb(null, CouponsManagementPage)
    }, 'CouponsManagementPage')
  },


})

