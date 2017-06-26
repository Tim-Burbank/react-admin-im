
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../config'

export default (store) => ({
  path : 'coupons_management/couponInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CouponInfo = require('./component/couponInfo').default
      const reducer = require('./module/couponInfo').default
      injectReducer(store, { key: 'couponInfo', reducer });
      cb(null, CouponInfo)
    }, 'CouponInfo')
  }
})
