// We only need to import the modules necessary for initial render
import {rootPath,chilPath} from '../config'
import {requireAuth} from '../components/authentication/requireAuth'
import LoginRoute from './Login'
import Layout from '../layouts/CoreLayout'
import Supplier_m from './Account_manager/Supplier_m/'
import SupplierInfo from './Account_manager/Supplier_m/supplierInfo/'
import Customer_m from './Account_manager/customer_m'
import CustomerInfo from './Account_manager/customer_m/customerInfo'
import Craftsman_m from './Account_manager/craftsman_m/'
import CraftsmanInfo from './Account_manager/craftsman_m/craftsmanInfo'
import CraftsmanNew from './Account_manager/craftsman_m/newCraftsman'
import Order_m from './Order_management/'
import OrderInfo from './Order_management/orderInfo/'
import Product_m from './Product_management/'
import ProductInfo from './Product_management/productInfo/'
import ProductNew from './Product_management/newProduct/'
import Information_push from './message_management/information_push'
import Feedback from './message_management/feedback'
import AdminSetting from './Admin_management/adminSetting'
import Coupons from './coupons_management'
import CouponInfo from './coupons_management/couponInfo'
import Role from './Admin_management/role'
import RoleInfo from './Admin_management/role/roleInfo'
import AdminInfo from './Admin_management/adminSetting/adminInfo'
import Withdraw from './Financial_management/withdraw'
import WithdrawInfo from './Financial_management/withdraw/withdrawInfo'
import CustomerFinance from './Financial_management/customer_detail'
import SupplierFinance from './Financial_management/supplier_detail'
import CustomerFinanceInfo from './Financial_management/customer_detail/customerFinanceInfo'
import SupplierFinanceInfo from './Financial_management/supplier_detail/supplierFinanceInfo'
import RecommendPosition from './Recommed_management/'

export const createRoutes = (store) => ({
  path        : '/',
  childRoutes : [
    {
      component:requireAuth(Layout),
      childRoutes:[
        Supplier_m(store),
        SupplierInfo(store),
        Customer_m(store),
        CustomerInfo(store),
        CraftsmanNew(store),
        Craftsman_m(store),
        Order_m(store),
        OrderInfo(store),
        Product_m(store),
        ProductInfo(store),
        ProductNew(store),
        CraftsmanInfo(store),
        Information_push(store),
        Feedback(store),
        AdminSetting(store),
        Coupons(store),
        CouponInfo(store),
        Role(store),
        RoleInfo(store),
        AdminInfo(store),
        Withdraw(store),
        WithdrawInfo(store),
        CustomerFinance(store),
        SupplierFinance(store),
        CustomerFinanceInfo(store),
        SupplierFinanceInfo(store),
        RecommendPosition(store)
      ]
    },
    LoginRoute(store)
  ]
});


/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
