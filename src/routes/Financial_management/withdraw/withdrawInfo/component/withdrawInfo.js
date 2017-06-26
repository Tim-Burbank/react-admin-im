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
import {ImmutableTable} from '../../../../../components/antd/Table'
import SimpleForm from '../../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../../components/title/title'
import {transactionStatus,withdrawDetail as _witD,titles as _tit,supplierType,supplierStatus,orderDetails as _ordD,supplierShowType,supplierDetails as _supd,gender,orderDetailTitle,orderStatus_type,customerDetails as _cusD,payment} from '../../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,configDirectoryObject,formatAddress} from '../../../../../utils/formatData'
import { fetchWithdrawInfo ,completeWithdrawInfo ,refusedWithdrawInfo} from '../module/withdrawInfo'
import {getFormRequired} from '../../../../../utils/common'

const RadioGroup = Radio.Group;
const Option = Select.Option;




class WithdrawInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      load:false,
      refused:null,
      modalLoad:false
    }
  }
  componentWillMount(){
    const {dispatch,params} = this.props;
    this.setState({load:true})
    dispatch(fetchWithdrawInfo(params.id,'get')).then((e)=>{
      if(e.error){
        this.setState({load:false})
        message.error(e.error.message);
      }else{
        this.setState({load:false})
      }
    });
  }




  handleSave=()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props;
    let json = {
      transactionStatus:0,
      note:this.state.refused
    }
    this.setState({modalLoad:true})
    dispatch(refusedWithdrawInfo(params.id,json)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({modalLoad:false})
            }else{
              this.setState({modalLoad:false,visible:false,load:true})
              message.success(formatMessage({id:'alrefused'}))
              dispatch(fetchWithdrawInfo(params.id,'get')).then((e)=>{
                if(e.error){
                  this.setState({load:false})
                  message.error(e.error.message);
                }else{
                  this.setState({load:false})
                }
              });
            }
    })
  }

  onChange = (e) => {
    this.setState({ refused: e.target.value });
  }

  complete= ()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props
    this.setState({load:true})
    dispatch(completeWithdrawInfo(params.id)).then((e)=>{
      if(e.error){
        this.setState({load:false})
        message.error(e.error.message);
      }else{
        this.setState({load:false})
        message.success(formatMessage({id:'withdrawSuccess'}));
      }
    });
  }

  refused=()=>{
    this.setState({visible:true})
  }


  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  }
  render(){
    const {intl:{formatMessage},withdrawInfo,location:{pathname},params} = this.props;
    const {previewVisible ,previewImage,newPage,visible } = this.state
    const column = [
      {dataIndex:_witD.transactionStatus,trans:configDirectoryObject,config:transactionStatus,bold:true},
      {dataIndex:_witD.username,deep:['account','username']},
      {dataIndex:_witD.name,deep:['account','supplier','name']},
      {dataIndex:_witD.createdAt},
      {dataIndex:_witD.cardId,deep:['account','supplier','cardId']},
      {dataIndex:_witD.identityCard,deep:['account','supplier','identityCard']},
    ];

    const cusColumn = [
      {dataIndex:_witD.withdrawBalance,deep:['account','wallet','withdrawBalance'],formatNum:formatMoney},
      {dataIndex:_witD.balance,deep:['account','wallet','balance'],formatNum:formatMoney},
      {dataIndex:_witD.wallerId,deep:['account','wallet','id']},
    ];



    const formColumns = [
      {dataIndex:'customerName',option:this.getRequiredMessage(formatMessage({id:'customerName'}))},
      {dataIndex:'customerMobile',option:this.getRequiredMessage(formatMessage({id:'customerMobile'}))},
      {dataIndex:'customer_address',option:this.getRequiredMessage(formatMessage({id:'customer_address'}))},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex})
      })
    );

    let cardHeader = (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <p className="title_words">{formatMessage({id:`withdraw_${_witD.supplierInfo}`})}</p>
        </Col>
      </Row>
    );

    let anotherCardHeader = (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <p className="title_words">{formatMessage({id:`withdraw_${_witD.withdrawInfo}`})}</p>
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
      }else if(column.formatNum){
        return column.formatNum(v)
      }else{
        return v
      }
    }

    const columnMap=column=>{
      let text
      if(withdrawInfo){
        text=column.deep?withdrawInfo.getIn(column.deep):withdrawInfo.get(column.dataIndex)
      }else{
        text= ''
      }
      let bold = column.bold
      return (
        <Col key={column.dataIndex} span={column.span || 12 } className='payment-item' style={{paddingLeft:'20%'}}>
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:`withdrawDetail_${column.dataIndex}`})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}}>{
            renderForm(text,column)
          }</span>
        </Col>
      )};
    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.withdraw_detail}`})} />
        <Spin  spinning={this.state.load} tip="Loading..." >
          <Card {...cardProps}>
            <Row className="payment-read">
              {column.map(columnMap)}
            </Row>
          </Card>

          <Card {...anotherCardProps}>
            <Row className="payment-read">
              {cusColumn.map(columnMap)}
            </Row>
          </Card>
          {withdrawInfo&&withdrawInfo.get('transactionStatus')==2&&<Row type="flex" justify="center" style={{marginTop:"20px"}}>
            <Button onClick={this.refused}  style={{marginRight:'20px'}} type="danger"  size="large">{formatMessage({id:'refusedTrans'})}</Button>
            <Button onClick={this.complete}  type="primary"  size="large">{formatMessage({id:'completeTrans'})}</Button>
          </Row>}
        </Spin>
        {/*<Row>
         <SimpleForm columns={newPage?newFormColumns:formColumns} initial={orderInfo} colSpan={12} labelCol={{span:5}} ref={f=>this.form=f} />
         </Row>*/}
        <Modal
          title={formatMessage({id:'refusedReason'})}
          visible={visible}
          onCancel={()=>this.setState({visible:false})}
          maskClosable={false}
          onOk={this.handleSave}
          okText="Refused"
          cancelText="Cancel"
          width={700}
        >
          <Spin  spinning={this.state.modalLoad} tip="Processing..." >
            <Input type="textarea" placeholder='Write something...' value={this.state.refused} onChange={this.onChange} autosize={{ minRows: 4, maxRows: 10 }} />
          </Spin>
        </Modal>
      </Row>
    )
  }
}





WithdrawInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};
const mapStateToProps = (state) => ({
  withdrawInfo : state.getIn(['withdrawInfo','withdrawInfo']),
});

export default injectIntl(connect(mapStateToProps)(WithdrawInfoPage))


