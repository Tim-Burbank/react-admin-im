/**
 * Created by Yurek on 2017/5/17.
 */
import React from 'react'
import OrderInfo from '../component/orderInfo'
import { connect } from 'react-redux'
const mapStateToProps = (state,props) => ({
  orderInfo:state.getIn(['orderInfo','orderInfo']),
})
export default connect(mapStateToProps)(OrderInfo)
