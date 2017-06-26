/**
 * Created by Yurek on 2017/5/17.
 */
/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,Card } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../components/antd/Table'
import SimpleForm from '../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../components/title/title'
import {titles as _tit,supplierType,supplierStatus,orderDetails as _ordD,supplierShowType,supplierDetails as _supd,gender,orderDetailTitle,orderStatus_type,customerDetails as _cusD,payment} from '../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,configDirectoryObject,formatAddress} from '../../../../utils/formatData'
import { fetchOrderInfo,cancelOrder } from '../module/orderInfo'
import {getFormRequired} from '../../../../utils/common'

const RadioGroup = Radio.Group;
const Option = Select.Option;




class OrderInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      load:false,
      modalLoad:false
    }
  }
  componentWillMount(){
    const {dispatch,params} = this.props;
    if(params.id =='new'){
      this.setState({newPage:true})
    }else{
      this.setState({load:true})
      dispatch(fetchOrderInfo(params.id,'get')).then((e)=>{
        if(e.error){
          message.error(e.error.message);
          this.setState({load:false})
        }else{
          this.setState({load:false})
        }
      });
    }

  }




  handleSave=()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        if(this.state.newPage){
          dispatch(fetchOrderInfo('','post',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
            }else{
              message.success(formatMessage({id:'save_ok'}))
            }
          })
        }else{
          values={
            ...values,
          }
          this.setState({modalLoad:true})
          dispatch(fetchOrderInfo(params.id,'put',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({modalLoad:false})
            }else{
              this.setState({modalLoad:false,load:true,visible:false})
              message.success(formatMessage({id:'modify_ok'}))
              dispatch(fetchOrderInfo(params.id,'get')).then(e=>{
                console.log(e)
                if(e.error){
                  message.error(e.error.message)
                  this.setState({load:false})
                }else{
                  this.setState({load:false})
                }
              })

            }
          })
        }
        //新增或编辑

      }
    });
  }

  modify= ()=>{
    this.setState({visible:true})
  }

  cancelOrder=()=>{
    const {dispatch,orderInfo,params} = this.props;
    this.setState({load:true})
    dispatch(cancelOrder(params.id)).then(e=>{
      console.log(e)
      if(e.error){
        message.error(e.error.message)
        this.setState({load:false})
      }else{
        message.success(formatMessage({id:'modify_ok'}))
        dispatch(fetchOrderInfo(params.id,'get')).then(e=>{
          console.log(e)
          if(e.error){
            message.error(e.error.message)
          }else{
            this.setState({load:false})
          }
        })

      }
    })
  }


  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  }
  render(){
    const {intl:{formatMessage},orderInfo,location:{pathname},params} = this.props;
    const {previewVisible ,previewImage,newPage,visible } = this.state
    const column = [
      {dataIndex:_ordD.productName,deep:['product','name']},
      {dataIndex:_ordD.orderStatus,trans:configDirectoryObject,config:orderStatus_type,bold:true},
      {dataIndex:_ordD.supplier,deep:['supplier','name']},
      {dataIndex:_ordD.craftsman,deep:['craftsman','name']},
      {dataIndex:_ordD.startDt},
      {dataIndex:_ordD.endDt},
      {dataIndex:_ordD.pressStart,deep:['startDt']},
      {dataIndex:_ordD.originPrice},
      {dataIndex:_ordD.currentPrice},
      {dataIndex:_ordD.craftsPhone,deep:['craftsman','account','mobile']},
    ];

    const cusColumn = [
      {dataIndex:_cusD.name,deep:['customer','name']},
      {dataIndex:_cusD.contact},
      {dataIndex:_cusD.payment,trans:configDirectoryObject,config:payment},
      {dataIndex:_cusD.pressEnd,deep:['endDt']},
      {dataIndex:'customer_address',format:formatAddress},
    ];




    const formColumns = [
      {dataIndex:'customerName',option:this.getRequiredMessage(formatMessage({id:'customerName'}))},
      {dataIndex:'contact'},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex})
      })
    );

    //const newFormColumns = [
    //
    //  {dataIndex:_supd.username,option:this.getRequiredMessage(formatMessage({id:'username'}))},
    //  {dataIndex:_supd.type,option:this.getRequiredMessage(formatMessage({id:'type'})),FormTag:<Select>
    //    {Object.keys(supplierShowType).map(type=><Option  key={type} value={type}>{formatMessage({id:`supplier_${type}`})}</Option>)}
    //  </Select>},
    //  {dataIndex:_supd.password,option:this.getRequiredMessage(formatMessage({id:'password'}))},
    //  ...formColumns,
    //].map(
    //  item=>({
    //    ...item,
    //    title:formatMessage({id:item.dataIndex})
    //  })
    //);

    let cardHeader = (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <p className="title_words">{formatMessage({id:`order_${orderDetailTitle.product_cra}`})}</p>
        </Col>
      </Row>
    );

    let anotherCardHeader = (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <p className="title_words">{formatMessage({id:`order_${orderDetailTitle.cust_info}`})}</p>
        </Col>
      </Row>
    );

    let cardProps = {
      title: cardHeader,
      style: {borderRadius: 0, marginBottom: 10},
      bodyStyle: {padding: '20px 0px 15px 10px', backgroundColor: '#f7f7f7'}
    };

    let anotherCardProps = {
      title: anotherCardHeader,
      style: {borderRadius: 0, marginBottom: 10},
      bodyStyle: {padding: '20px 0px 15px 10px', backgroundColor: '#f7f7f7'}
    };

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
      }else{
        return v
      }
    }

    const columnMap=column=>{

      let text
      if(orderInfo){
        text=column.deep?orderInfo.getIn(column.deep):orderInfo.get(column.dataIndex)
      }else{
        text= ''
      }
      let bold = column.bold
      return (
        <Col key={column.dataIndex} span={column.span || 12 } className='payment-item' style={{paddingLeft:'20%'}}>
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:`orderDetail_${column.dataIndex}`})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}}>{
            renderForm(text,column)
          }</span>
        </Col>
      )};
    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.order_detail}`})} />
        <Row type="flex" justify="end" style={{marginTop:"20px",marginBottom:'20px'}}>
          {orderInfo&&orderInfo.get('orderStatus') == 0&&<Button onClick={this.cancelOrder}  style={{marginRight:'10px'}} type="danger" size="small">{formatMessage({id:'cancelOrder'})}</Button>}
        </Row>
        <Spin  spinning={this.state.load} tip="Loading..." >
          {!newPage&&
          <Card {...cardProps}>
            <Row className="payment-read">
              {column.map(columnMap)}
            </Row>
          </Card>
          }
          <Row span={24} style={{marginTop:'15px',marginBottom:'15px'}}>
            <Col span={6} style={{textAlign:'center'}}>
              {orderInfo&&<Link to={{pathname:'/product_management/productInfo/' + orderInfo.get('productId')}}>
                {formatMessage({id:"viewPro"})}
              </Link>}
            </Col>
            <Col span={6} style={{textAlign:'center'}}>
              {orderInfo&&<Link to={{pathname:'/supplier_management/supplierInfo/' + orderInfo.get('supplierId')}}>
                {formatMessage({id:"viewSup"})}
              </Link>}
            </Col>
            <Col span={6} style={{textAlign:'center'}}>
              {orderInfo&&<Link to={{pathname:'/craftsman_management/craftsmanInfo/' + orderInfo.get('craftsmanId')}}>
                {formatMessage({id:"viewCra"})}
              </Link>}
            </Col>
            <Col span={6} style={{textAlign:'center'}}>
              {orderInfo&&<Link to={{pathname:'/customer_management/customerInfo/' + orderInfo.get('customerId')}}>
                {formatMessage({id:"viewCus"})}
              </Link>}
            </Col>
          </Row>
          <Card {...anotherCardProps}>
            <Row className="payment-read">
              {cusColumn.map(columnMap)}
            </Row>
          </Card>
          <Row type="flex" justify="center" style={{marginTop:"20px"}}>
            <Button onClick={this.modify}  type="primary" size="large">{formatMessage({id:'modify'})}</Button>
          </Row>
        </Spin>
        {/*<Row>
          <SimpleForm columns={newPage?newFormColumns:formColumns} initial={orderInfo} colSpan={12} labelCol={{span:5}} ref={f=>this.form=f} />
        </Row>*/}
        <Modal
          title={formatMessage({id:'order_edit'})}
          visible={visible}
          onCancel={()=>this.setState({visible:false})}
          maskClosable={false}
          onOk={this.handleSave}
          width={700}
          okText="Save"
          cancelText="Cancel"
        >
          {<Spin  spinning={this.state.modalLoad} tip="Processing..." >
            <Row>
              <SimpleForm columns={formColumns} initial={orderInfo} colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
            </Row>
            </Spin>}
        </Modal>
      </Row>
    )
  }
}





OrderInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

export default injectIntl(OrderInfoPage)


