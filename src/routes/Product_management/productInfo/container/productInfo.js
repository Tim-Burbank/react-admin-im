/**
 * Created by Yurek on 2017/5/17.
 */
import React from 'react'
import ProductInfoPage from '../component/ProductInfo'
import { connect } from 'react-redux'
const mapStateToProps = (state,props) => ({
  productInfo:state.getIn(['productInfo','productInfo']),
})
export default connect(mapStateToProps)(ProductInfoPage)
