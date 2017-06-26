/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../components/antd/Table'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import { pathJump } from '../../../utils/'
import TopSearch from '../../../components/search/topSearch'
import Title from '../../../components/title/title'
import {titles as _tit,supplierType,supplierStatus,orderTableFielsd as _ord,supplierShowType,rlsStatus,orderStatus,orderStatus_type} from '../../../config'
import Immutable from 'immutable'
import {fetchOrder} from '../module/orderManagement'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../utils/formatData'


class OrderManagementPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:null,
    }
  }

  componentWillMount(){
    const {dispatch,params,location} = this.props;
    if(location && location.query){
      this.setState({loading:true});
      dispatch(fetchOrder(location.query)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
        }else{
          this.setState({loading:false})
        }
      });
    }
  }
  onFetch = (values) =>{
    const {dispatch,order}=this.props;
    if(order&&order.length<1){
      this.setState({loading:true});
    }
    //获取数据
    dispatch(fetchOrder(values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
      }else{
        this.setState({loading:false})
      }
    });
  };

  create=e=>{
    const {dispatch} = this.props
    dispatch(pathJump('supplier_management/supplierInfo/new'))
  };

  //getcontent=()=>{
  //  return <Button onClick={this.create} type='primary'>New Supplier</Button>
  //};
  cancelOrder=()=>{

  }


  onPageChange=(pageNumber)=>{
    console.log('Page: ', pageNumber);
  }

  render(){
    const {intl:{formatMessage},order,location:{pathname}} = this.props;
    console.log('pathname',pathname)

    const { loading } = this.state
    const columns = [
      {dataIndex:_ord.craftsman,render:(text,record)=>{
        return record.getIn(['craftsman','account','username'])
      }},

      {dataIndex:_ord.supplier,render:(text,record)=>{
        return record.getIn(['craftsman','supplierUsername'])
      }},
      {dataIndex:_ord.customer,render:(text,record)=>{
        return record.getIn(['customer','account','username'])
      }},
      {dataIndex:_ord.createdAt},
      {dataIndex:_ord.startDt},
      {dataIndex:_ord.endDt},
      {dataIndex:_ord.orderStatus,render:(text,record)=>{
        return configDirectoryObject(text,orderStatus_type)
      }},
      {dataIndex:_ord.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/orderInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`order_${item.dataIndex}`}),
      })
    )

    this.formColumns=[
      {dataIndex:'startDt_gte',type:'date',},
      {dataIndex:'endDt_lte',type:'dateSingle'},
      {dataIndex:'option',placeholder:'option',type:'select',selectOption:['Craftsman name','Supplier name','Customer name']},
      {dataIndex:'keywords',formTag:'input'},
      {dataIndex:'orderStatus_in',placeholder:formatMessage({id:'select_ord_status'}),type:'select',selectOption:orderStatus},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    )

    let searchProps={
      formColumns:this.formColumns,
      onSave:this.onFetch,
      //rightContent:this.getcontent()
    };

    const Selection = {
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedNum:selectedRowKeys});
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);

      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
      }),
    };

    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.order_management}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          {/*<Button onClick={this.cancelOrder} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_stopAc'})}</Button>*/}
          {this.state.selectedNum!=null &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>
        <ImmutableTable
          loading={loading}
          style={{marginTop:20}}
          columns={columns}
          dataSource={order}
          pagination={{ pageSize: 13,total:order&&order.size }}
        />
      </Row>
    )
  }
}

OrderManagementPage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  order : state.getIn(['orderManagement','order']),
});

export default injectIntl(connect(mapStateToProps)(OrderManagementPage))


//const WrappedSystemUser = Form.create()();


