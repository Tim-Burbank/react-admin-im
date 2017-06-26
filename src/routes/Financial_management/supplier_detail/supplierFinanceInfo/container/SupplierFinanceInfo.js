/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Modal,Col,Input ,Card,Icon  } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../../components/antd/Table'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import { pathJump,takeId } from '../../../../../utils/'
import TopSearch from '../../../../../components/search/topSearch'
import Title from '../../../../../components/title/title'
import {financeStatus,financeTableField as _finT,financeInfoTableField as _finIT,transaction,withdrawStatus,transactionStatus,withdrawTableField as _witT , titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,rlsStatus} from '../../../../../config'
import Immutable from 'immutable'
import {fetchSupplierFinanceInfo,fetchSupplierTrans,updateSupplierFinanceInfo} from '../module/supplierFinanceInfo'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../../utils/formatData'




class SupplierFinanceInfo extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      currentPage:1,
      load:false,
      capModal:false,
      modalLoad:false,
      capBalanceNum:null
    }
  }


  componentWillMount(){
    const {dispatch,params,location} = this.props;
    if(location && location.query){
      this.setState({loading:true,load:true});
      dispatch(fetchSupplierFinanceInfo(params.id,location.query)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
          this.setState({load:false})
        }else{
          this.setState({load:false})
        }
      });

      let json = {
        accountId:params.id,
        transactionType:2
      }
      dispatch(fetchSupplierTrans(json)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
          this.setState({loading:false})
        }else{
          this.setState({loading:false})
        }
      });
    }
  }

  onFetch = (values) =>{
    this.setState({loading:true});
    const {dispatch,params}=this.props;

    //获取数据
    dispatch(fetchSupplierFinanceInfo(params.id,values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({loading:false})
      }else{
        this.setState({loading:false})
      }
    });
  };


  takeName=(v)=>{
    let arr = [];
    for(let o in v){
      if(o == 'name'){
        for(let x in v[o]){
          arr.push(x)
        }
      }
    }
    return arr
  }

  //create=e=>{
  //  const {dispatch} = this.props
  //  dispatch(pathJump('craftsman_management/new_craftsman'))
  //};

  //
  getcontent=()=>{
    const {intl:{formatMessage}} = this.props
    return (
      <Col>
        <p>{formatMessage({id:"financeRecord"})}</p>
      </Col>
    )
  };

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }

  handleAccount=(action,rls,tips)=>{
    const {dispatch,withdraw,intl:{formatMessage}} = this.props
    let _supData= withdraw.toJS()
    let idArr = [];
    let _selectedNum = this.state.selectedNum
    let page = this.state.currentPage
    if(_selectedNum.length>0) {
      if (page == 1) {
        _selectedNum.map(z=> {
          idArr.push(_supData[z]['id'])
        })
      } else {
        _selectedNum.map(z=> {
          console.log('page', z + (page - 1) * 13)
          idArr.push(_supData[z + (page - 1) * 13]['id'])
        })
      }

      console.log(idArr)
      let json = {
        ids: idArr,
        rlsStatus: rls
      }
      this.setState({loading:true});
      dispatch(action(json, this.state.searchOption)).then(e=> {
        if (e.payload) {
          message.success(tips + this.state.selectedNum.length + " account success")
          this.setState({loading: false, selectedNum: []});
        }else{
          message.error(e.error.message)
        }
      })
    }else{
      message.error(formatMessage({id:"selectOne"}))
    }
  }

  handleSave=()=>{
    const {dispatch,params,intl:{formatMessage},supplierFinanceInfo} = this.props;
    const {capBalanceNum} = this.state
    let json = {
      capitalBalance:capBalanceNum
    }
    this.setState({modalLoad:true})
    dispatch(updateSupplierFinanceInfo(supplierFinanceInfo.getIn(['wallet','id']),params.id,json)).then(e=>{
      console.log(e)
      if(e.error){
        message.error(e.error.message)
        this.setState({modalLoad:false})
      }else{
        this.setState({modalLoad:false,capModal:false})
        message.success(formatMessage({id:'successManBalance'}))
      }
    })
  }


  optFreezedMoney=(v)=>{
    if(v){
      return formatMoney(v.get('guarantee')+v.get('commissionBalance'))
    }
  }


  render(){
    const {intl:{formatMessage},supplierFinanceInfo,location:{pathname},supplierFinanceTrans} = this.props;
    const {capModal,capBalanceNum} = this.state
    console.log('pathname',pathname)


    const { loading } = this.state
    const columns = [
      {dataIndex:_finIT.createdAt,render:date=>formatDate(date)},
      {dataIndex:_finIT.name,render:(text,record)=>{
        return configDirectoryObject(text,transaction.name)
      }},
      {dataIndex:_finIT.amount,render:(text,record)=>{
        if(record.get('type')==1){
          return (<span style={{color:'green'}}>{'+'+formatMoney(text)}</span>)
        }else{
          return (<span style={{color:'red'}}>{'-'+formatMoney(text)}</span>)
        }
      }},
      {dataIndex:_finIT.order,render:(text,$record)=>{
        if($record.has('orderId')){

          return (
            <Link to={{pathname:'/order_management/orderInfo/'+$record.get('orderId')}}>
              {formatMessage({id:"view"})}
            </Link>)
        }else{
          return (<span></span>)
        }
      }},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`financeInfo_${item.dataIndex}`})
      })
    )


     /*
     add withdraw status filter
     add withdraw status filter
     add withdraw status filter
    */


    //this.formColumns=[
    //  {dataIndex:'createdAt_between',type:'date'},
    //  {dataIndex:'operation',placeholder:formatMessage({id:'select_withdraw_status'}),type:'select',selectOption:this.takeName(transaction)},
    //].map(
    //  item=>({
    //    ...item,
    //    title:formatMessage({id:`search_${item.dataIndex}`}),
    //  })
    //)

    this.formColumns=[
      {dataIndex:'createdAt_between',type:'date'},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    )

    let cardProps = {
      style: {borderRadius: 0, marginBottom: 10},
      bodyStyle: {padding: '20px 0px 15px 10px', backgroundColor: '#f7f7f7'}
    };


    let searchProps={
      formColumns:this.formColumns,
      onSave:this.onFetch,
      rightContent:this.getcontent()
    };



    const column = [
      {dataIndex:_finT.username},
      {dataIndex:_finT.status,trans:configDirectoryObject,config:financeStatus,bold:true,deep:['wallet','status']},
      {dataIndex:_finT.balance,deep:['wallet','balance'],formatNum:formatMoney},
      {dataIndex:_finT.capitalBalance,deep:['wallet','capitalBalance'],formatNum:formatMoney},
      {dataIndex:_finT.wallet,formatNum:this.optFreezedMoney},
      {dataIndex:_finT.mobile},
    ];


    const renderForm=(v,column)=>{
      if(v == 0){
        if(column.trans){
          return column.trans(v,column.config)
        }else{
          return 0
        }
      }
      if(v == undefined || v=='') return
      if(column.trans){
        return column.trans(v,column.config)
      }else if(column.format){
        return column.format(v).map((t,i)=>(
          <Row key={i} >
            {t}
          </Row>
        ))
      }else if(column.formatNum){
        return column.formatNum(v)
      }else{
        return v
      }
    }

    const columnMap=column=>{
      let text
      if(supplierFinanceInfo){
        text=column.deep?supplierFinanceInfo.getIn(column.deep):supplierFinanceInfo.get(column.dataIndex)
      }else{
        text= ''
      }
      let bold = column.bold
      return (
        <Col key={column.dataIndex} span={column.span || 12 } className='payment-item' style={{paddingLeft:'20%'}}>
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:`finance_${column.dataIndex}`})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}}>{
            renderForm(text,column)
          }</span>
        </Col>
      )};
    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.financeDetail}`})} />
        <Spin  spinning={this.state.load} tip="Loading..." >
          <Card {...cardProps}>
            <Row className="payment-read">
              {column.map(columnMap)}
            </Row>
            <Row type="flex" justify="center" style={{marginTop:"30px",marginBottom:"10px"}}>
              <Button onClick={()=>{this.setState({capModal:true,capBalanceNum:supplierFinanceInfo.getIn(['wallet','capitalBalance'])})}}  type="primary" style={{marginRight:'20px'}} size="large">{formatMessage({id:'capBalance'})}</Button>
            </Row>
          </Card>
          <TopSearch  {...searchProps} />
          <ImmutableTable
            loading={loading}
            style={{marginTop:20}}
            columns={columns}
            dataSource={supplierFinanceTrans}
            pagination={{ pageSize: 13,total:supplierFinanceTrans&&supplierFinanceTrans.size }}
          />
        </Spin>
        <Modal
          title={formatMessage({id:'capBalance'})}
          visible={capModal}
          onCancel={()=>this.setState({capModal:false})}
          maskClosable={false}
          onOk={this.handleSave}
          okText="Ok"
          cancelText="Cancel"
          width={700}
        >

          <Spin  spinning={this.state.modalLoad} tip="Processing..." >
            <Row type="flex" justify="start" >
              <Col style={{marginRight:'20px'}}>
                <p>{formatMessage({id:`finance_${_finT.capitalBalance}`})}:</p>
              </Col>
              <Col>
                <Button onClick={()=>{this.setState({capBalanceNum:capBalanceNum-100})}}  type="primary" size='small' style={{marginRight:'20px'}} size="large"><Icon type="minus" /></Button>
                <Input style={{width:'120px',marginRight:'20px'}}   value={capBalanceNum} onChange={(e)=>{
                  if(!isNaN(e.target.value)){
                    this.setState({ capBalanceNum: e.target.value });
                  }
                }} />
                <Button onClick={()=>{this.setState({capBalanceNum:capBalanceNum+100})}}  type="primary" size='small' style={{marginRight:'20px'}} size="large"><Icon type="plus" /></Button>
              </Col>
            </Row>
          </Spin>
        </Modal>
      </Row>
    )
  }
}

SupplierFinanceInfo.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  supplierFinanceInfo : state.getIn(['supplierFinanceInfo','supplierFinanceInfo']),
  supplierFinanceTrans:state.getIn(['supplierFinanceInfo','supplierFinanceTrans']),
});

export default injectIntl(connect(mapStateToProps)(SupplierFinanceInfo))


//const WrappedSystemUser = Form.create()();


