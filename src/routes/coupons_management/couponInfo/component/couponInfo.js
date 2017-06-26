
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../components/antd/Table'
import SimpleForm from '../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../components/title/title'
import {voucherStatus,titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,product_category,couponPayType,product_subcategory,couponDetail as _coupD ,customerFreezed,customerDetails as _cusd,gender,freezed_type} from '../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,formatAddress,configCate} from '../../../../utils/formatData'
import { fetchCouponInfo, updateCouponInfo} from '../module/couponInfo'
import {getFormRequired} from '../../../../utils/common'
import { pathJump } from '../../../../utils/'
const RadioGroup   = Radio.Group;
const Option = Select.Option;





class CouponInfoPage extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      addressModal:false,
      category:null
    }
  }

  componentWillMount(){
    this.setState({load:true});
    const {dispatch,params} = this.props;
    if(params.id =='new'){
      this.setState({newPage:true})
    }else{
      dispatch(fetchCouponInfo(params.id,'get')).then((e)=>{
        console.log('willmount',e)
        if(e.error){
          this.setState({load:false})
          message.error(e.error.message);
        }else{
          this.setState({load:false})
        }
      });
    }

  }




  handleSave=()=>{
    this.setState({load:true});
    const {dispatch,params,intl:{formatMessage},couponInfo} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        //if(this.state.newPage){
        //  dispatch(fetchSupplierInfo('','post',values)).then(e=>{
        //    console.log(e)
        //    if(e.error){
        //      message.error(e.error.message)
        //    }else{
        //      message.success(formatMessage({id:'save_ok'}))
        //    }
        //  })
        //}else{
        values = {
          ...values,
        }


          dispatch(fetchCouponInfo(params.id,'put',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({load:false});
            }else{
              this.setState({load:false});
              dispatch(fetchCouponInfo(params.id,'get'))
              this.setState({visible:false})
              message.success(formatMessage({id:'modify_ok'}))
            }
          });


      }
    });
  }
  modify=()=>{
    this.setState({visible:true})
  };

  handleAccount=(action,rls,tips,type)=>{
    this.setState({loading:true});
    const {dispatch,couponInfo,params} = this.props

    let json = {
      ids:couponInfo.get('id'),
      expire:rls
    }
    this.setState({load:true})
    dispatch(action(params.id,json,type))
      .then(e=>{
        console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({load:false});
        }else{
          message.success(tips+" coupon success")
          this.setState({load:false});
        }
      })

  }
  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  }

  onOk=()=>{
    this.setState({visible:false})
  }

  modifyAddress=()=>{
    this.setState({addressModal:true})
  };

  addressSave=()=>{
    this.setState({addressModal:false})
  }





  render(){
    const {intl:{formatMessage},couponInfo,location:{pathname},params} = this.props;
    const {visible,newPage ,addressModal,category} = this.state;
    console.log('couponInfo',couponInfo)
    const renderCategory=(cate)=>{
      let _arr = []
      for(let v in cate){
        _arr.push(cate[v])
      }
      return _arr.map((v,i)=>(
        <Option key={i} value={v.id}>{v.name_en}</Option>
      ))
    }
    const renderOption = (cate,config,key) =>{
      let _opt=[]
      for(let v in config){
        if(cate == config[v][key]){
          _opt.push(config[v])
        }
      }

      return _opt.map((v,i)=>(
        <Option key={i} value={v.id}>{v.name_en}</Option>
      ))
    };



    const column = [
      {dataIndex:_coupD.name_en},
      {dataIndex:_coupD.expire,trans:configCate,config:voucherStatus,bold:true},
      {dataIndex:_coupD.used},
      {dataIndex:_coupD.startDt},
      {dataIndex:_coupD.endDt},
      {dataIndex:_coupD.quantity},
      {dataIndex:_coupD.gtLimitation,formatNum:formatMoney},
      {dataIndex:_coupD.value,formatNum:formatMoney},
      {dataIndex:_coupD.categoryIds},
      {dataIndex:_coupD.subcategoryIds},
      {dataIndex:_coupD.description},
      {dataIndex:_coupD.paymentType,trans:configCate,config:couponPayType},
      {dataIndex:_coupD.code},
      {dataIndex:_coupD.wblists,deep:['wblists','0','account','username']},
    ];

    const formColumns = [
      {dataIndex:_coupD.name_en,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.name_en}`}))},
      {dataIndex:_coupD.expire,FormTag:
        <Select  placeholder="Please select">
          {renderCategory(voucherStatus)}
        </Select>},
      {dataIndex:_coupD.startDt,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.startDt}`}))},
      {dataIndex:_coupD.endDt,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.endDt}`}))},
      {dataIndex:_coupD.quantity},
      {dataIndex:_coupD.gtLimitation},
      {dataIndex:_coupD.value,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.value}`}),'number')},
      {dataIndex:_coupD.description,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.description}`})),FormTag:
        <Input type="textarea" placeholder="Product description" autosize={{ minRows: 2}} />},
      {dataIndex:_coupD.categoryIds,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.categoryIds}`})),FormTag:
        <Select  onChange={(v)=>{this.setState({category:v})}} placeholder="Please select">
          {renderCategory(product_category)}
        </Select>},
      {dataIndex:_coupD.subcategoryIds,FormTag:
        <Select  placeholder="Please select">
          {renderOption(category!==null&&category,product_subcategory,'categoryId')}
        </Select>},
      {dataIndex:_coupD.paymentType,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.paymentType}`})),FormTag:
        <Select  placeholder="Please select">
          {renderCategory(couponPayType)}
        </Select>},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`coupon_${item.dataIndex}`})
      })
    );



    const renderForm=(v,column)=>{
      console.log('column',v);

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
      if(couponInfo){
        text=column.deep?couponInfo.getIn(column.deep):couponInfo.get(column.dataIndex)
      }else{
        text= ''
      }
      let bold = column.bold
      return (
        <Col key={column.dataIndex} span={column.span ||24} className='payment-item' style={{paddingLeft:'20%'}} >
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:`coupon_${column.dataIndex}`})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}} >{
            renderForm(text,column)
          }</span>
        </Col>
      )};
    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.coupon_detail}`})} />
        <Row type="flex" justify="end" style={{marginTop:"20px",marginBottom:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updateCouponInfo,1,'Active ',2)}  style={{marginRight:'10px'}} type="primary" >{formatMessage({id:'couponActive'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCouponInfo,2,'Expired ',2)}  style={{marginRight:'10px'}} type="danger" >{formatMessage({id:'couponExpired'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCouponInfo,3,'Failure ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'couponFailure'})}</Button>
        </Row>
        <Spin spinning={this.state.load} tip="Loading...">
          <Row className="payment-read">

            {column.map(columnMap)}
          </Row>
          {couponInfo&&couponInfo.get('expire')==0&&<Row type="flex" justify="center" style={{marginTop:"50px"}} >
            <Button onClick={this.modify} style={{marginRight:'10px'}} type="primary" size="large">{formatMessage({id:'modify'})}</Button>
          </Row>}
        </Spin>
        <Modal
          title={formatMessage({id:'customer_edit'})}
          visible={visible}
          onCancel={()=>this.setState({visible:false})}
          maskClosable={false}
          onOk={this.handleSave}
          width={700}
          okText="Save"
          cancelText="Cancel"
        >
          {<Row>
            <SimpleForm columns={formColumns} initial={couponInfo} colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
          </Row>}
        </Modal>
      </Row>
    )
  }
}





CouponInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

const mapStateToProps = (state,props) => ({
  couponInfo:state.getIn(['couponInfo','couponInfo']),
})
export default injectIntl(connect(mapStateToProps)(CouponInfoPage))




