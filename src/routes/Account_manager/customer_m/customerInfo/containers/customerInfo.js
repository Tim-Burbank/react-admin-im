/**
 * Created by Yurek on 2017/5/17.
 */
import React from 'react'
import SupplierInfo from '../component/customerInfo'
import { connect } from 'react-redux'
const mapStateToProps = (state,props) => ({
  customerInfo:state.getIn(['customerInfo','customerInfo']),
})
export default connect(mapStateToProps)(SupplierInfo)
