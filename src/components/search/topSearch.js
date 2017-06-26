/**
 * Created by Yurek on 2017/5/12.
 */
import React from 'react'
import { Form, Row, Col, Input, Button, Icon,DatePicker ,Card,Select } from 'antd'
const Search = Input.Search;
const FormItem = Form.Item;
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
import './topSearch.scss'
import { getFormTag } from '../../components/'
import {formatDate,formatMoney,configDirectory,configCate} from '../../utils/formatData'
import {rlsStatus,freezed,orderStatus_type,proStatus,feedbackReplyStatus,voucherStatus,transactionStatus,financeStatus} from '../../config'




class TopSearch extends React.Component {

  checkType=(v)=>{
    if(v == 'Business supplier'){
      return "1"
    }else if(v == 'Person supplier'){
      return "0"
    }else{
      return ''
    }
  };

  handleSearch=()=>{
    this.props.form.validateFields((err, fieldsValue) => {
      const _rangeValue = fieldsValue['createdAt_between'];
      const _type = fieldsValue['type'];
      const _option = fieldsValue['option'];
      const _keyword = fieldsValue['keywords'];
      const _status = fieldsValue['account_status'];
      const _freezed = fieldsValue['freezed'];
      const _orderStatus = fieldsValue['orderStatus_in'];
      const _startDt = fieldsValue['startDt_gte'];
      const _endDt=fieldsValue['endDt_lte'];
      const _adRls = fieldsValue['adminRls']
      const _createAt = fieldsValue['createdAt'];
      const _updateAt = fieldsValue['updatedAt'];
      const _group = fieldsValue['group'];
      const _replied = fieldsValue['replied'];
      const _couponStatus = fieldsValue['couponStatus']
      const _traStatus = fieldsValue['transactionStatus']
      const _supName = fieldsValue['supplier_name']
      const _finStatus = fieldsValue['finance_status']
      const _supType = fieldsValue['supplier_type']

      for( let v in fieldsValue){
        if(fieldsValue[v] == 'All'){
          fieldsValue[v] = undefined
        }
      }

      let values = {
        ...fieldsValue,
      }
      if(_rangeValue){
        values = {
          ...values,
          'createdAt_between': fieldsValue['createdAt_between']?[_rangeValue[0].format('YYYY-MM-DD'), _rangeValue[1].format('YYYY-MM-DD')].join(','):'',
        }
      }
      if(_type){
        values = {
          ...values,
          'type':this.checkType(_type)
        }
      }
      if(_option =='username'){
        values = {
          ...values,
          'account.username':_keyword
        }
      }else if(_option =='phone number'){
        values = {
          ...values,
          'account.mobile':_keyword
        }
      }else if(_option =='supplier username'){
        values = {
          ...values,
          'supplierUsername':_keyword
        }
      }else if(_option =='Craftsman name'){
        values = {
          ...values,
          'craftsman.account.username':_keyword
        }
      }else if(_option =='Customer name'){
        values = {
          ...values,
          'customer.account.username':_keyword
        }
      }else if(_option =='Supplier name'){
        values = {
          ...values,
          'supplier.account.username':_keyword
        }
      }else if(_option =='Supplier Name'){
        values = {
          ...values,
          'supplierUsername':_keyword
        }
      }else if(_option =='Craftsman Name'){
        values = {
          ...values,
          'craftsmanUsername':_keyword
        }
      }else if(_option =='customer'){
        values = {
          ...values,
          'usertype':1,
          'userName':_keyword
        }
      } else if(_option =='craftsman'){
        values = {
          ...values,
          'usertype':3,
          'userName':_keyword
        }
      }
      else if(_option =='supplier'){
        values = {
          ...values,
          'usertype':2,
          'userName':_keyword
        }
      }else if(_option =='coupon name'){
        values = {
          ...values,
          'name':_keyword
        }
      }
      else if(_option =='Admin Username'){
        values = {
          ...values,
          'username':_keyword
        }
      }


      if(_status){
        values = {
          ...values,
          rlsStatus:configDirectory(_status,rlsStatus)
        }
      }
      if(_freezed){
        values = {
          ...values,
          statu:configDirectory(_freezed,freezed)
        }
      }

      if(_orderStatus){
        values = {
          ...values,
          orderStatus_in:configDirectory(_orderStatus,orderStatus_type)
        }
      }

      if(_startDt){
        values = {
          ...values,
          'startDt_gte': fieldsValue['startDt_gte']?[_startDt[0].format('YYYY-MM-DD'), _startDt[1].format('YYYY-MM-DD')].join(','):'',
        }
      }

      if(_endDt){
        values = {
          ...values,
          'endDt_lte': fieldsValue['endDt_lte']?_endDt.format('YYYY-MM-DD'):'',
        }
      }
      if(_createAt){
        values = {
          ...values,
          'createdAt': fieldsValue['createdAt']?[_createAt[0].format('YYYY-MM-DD'), _createAt[1].format('YYYY-MM-DD')].join(','):'',
        }
      }

      if(_updateAt){
        values = {
          ...values,
          'updatedAt': fieldsValue['updatedAt']?[_updateAt[0].format('YYYY-MM-DD'), _updateAt[1].format('YYYY-MM-DD')].join(','):'',
        }
      }
      if(_adRls){
        values = {
          ...values,
          'adminRls': configDirectory(_adRls,freezed)
        }
      }

      if(_group){
        values = {
          ...values,
          'group':fieldsValue['group']?1:0
        }
      }

      if(_replied){
        values = {
          ...values,
          'replied':configDirectory(_replied,feedbackReplyStatus)
        }
      }

      if(_couponStatus){
        values = {
          ...values,
          'expire':configCate(_couponStatus,voucherStatus)
        }
      }

      if(_traStatus){
        values = {
          ...values,
          'transactionStatus':configDirectory(_traStatus,transactionStatus)
        }
      }

      if(_supName){
        values = {
          ...values,
          'account.username':_supName
        }
      }

      if(_finStatus){
        values = {
          ...values,
          'status':configDirectory(_finStatus,financeStatus)
        }
      }

      if(_supType){
        values = {
          ...values,
          'supplier.type':this.checkType(_supType)
        }
      }

      console.log('Received values of form: ', values);
      this.props.onSave(values);
    });

    //const {form,onSave}=this.props;
    //let values = form.getFieldsValue();
    //console.log(values)
    //onSave(values);

  };

  handleReset = () => {
    this.props.form.resetFields();
  };


  render(){
    const {getFieldDecorator}=this.props.form;
    const {formColumns,rightContent}=this.props;
    console.log('rightContent',rightContent)
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 13 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 11 },
      },

    };

    let formContent = formColumns.map(item=> {
      //设置表单初始值
      let options = item.options?item.options:{};
      //初始化FieldProps
      let formDom=getFormTag(item);
      console.log('formDom',formDom);
      return (
        <Col sm={{ span: 24 }} md={{ span:12 }} lg={{ span: 12 }} xl={{ span: 6 }} key={item.dataIndex}>
            <FormItem
              key={`search_${item.dataIndex}`}
              label={item.noLable?null:item.title}
              {...formItemLayout}
              style={{width: item.width || 200, marginTop: 5}}
            >
              {getFieldDecorator(item.dataIndex,options)(formDom)}
            </FormItem>
        </Col>
      )
    }, this);

    let searchHeader = (
      <Row>
        <Col span={12} style={{ textAlign: 'left' }}>
          {rightContent&&rightContent}
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSearch} >Search</Button>
          <Button style={{ marginLeft: 8 }}  onClick={this.handleReset}>
            Clear
          </Button>
        </Col>
      </Row>
    );

    let searchProps = {
      title: searchHeader,
      className: "search-bar",
      style: {borderRadius: 0, marginBottom: 10},
      bodyStyle: {padding: '20px 0px 15px 10px', backgroundColor: '#f7f7f7'}
    };



    return(
      <Card {...searchProps}>
        <Form >
            <Row gutter={16}>
              {formContent}
            </Row>
          </Form>
      </Card>
    )
  }
}


export default  Form.create()(TopSearch)
