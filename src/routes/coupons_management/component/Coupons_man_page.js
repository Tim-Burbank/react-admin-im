/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Modal,Col,Select,Input ,DatePicker  } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../components/antd/Table'
import ImmutablePropTypes from 'react-immutable-proptypes'
import SimpleForm from '../../../components/antd/SimpleForm'
import {Link} from 'react-router'
import { pathJump } from '../../../utils/'
import TopSearch from '../../../components/search/topSearch'
import Title from '../../../components/title/title'
import {couponPayType,product_subcategory,voucherStatus,titles as _tit,supplierType,couponDetail as _coupD,supplierStatus,supplierTableFields as _sup,supplierShowType,product_category,rlsStatus,productCate,couponsStatus,couponsTableField as _coupT} from '../../../config'
import Immutable from 'immutable'
import {fetchCoupons,updateCoupons,newCoupons} from '../module/couponsManagement'
import {formatDate,formatMoney,configDirectory,configDirectoryObject,configCate} from '../../../utils/formatData'
import {pushInfo,groupPushInfo} from '../../message_management/information_push/module/informationPush'
import {getFormRequired} from '../../../utils/common'
import {fetchSupplier,updateSupplier} from '../../Account_manager/Supplier_m/module/supplierManagement'

const Option = Select.Option;
const Search = Input.Search;



class CouponsManagementPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      selectedRows:null,
      searchOption:null,
      currentPage:1,
      couponModal:false,
      couponLoad:null,
      category:null,
      formStep:[],
    }
  }

  componentWillMount(){
    const {dispatch,params,location} = this.props;
    if(location && location.query){
      this.setState({loading:true});
      dispatch(fetchCoupons(location.query)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
        }else{
          this.setState({loading:false})
        }
      });
    }
  }

  onFetch = (values) =>{
    this.setState({loading:true});
    this.setState({searchOption:values})
    const {dispatch,couponsManagement}=this.props;
    //获取数据
    dispatch(fetchCoupons(values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({loading:false})
      }else{
        this.setState({loading:false})
      }
    });
  };





  getcontent=()=>{
    const {dispatch,couponsManagement,intl:{formatMessage}} = this.props
    return (
      <Col>
        <Button style={{marginRight:'10px'}} onClick={()=>{this.setState({couponModal:true})}} type='primary'>{formatMessage({id:"newCoupon"})}</Button>
      </Col>
    )
  };

  handleAccount=(action,rls,tips)=>{

    const {dispatch,couponsManagement,intl:{formatMessage}} = this.props
    let _supData= couponsManagement.toJS()
    let idArr = [];
    let _selectedNum = this.state.selectedNum
    let page = this.state.currentPage
    if(_selectedNum.length>0){
      if(page == 1){
        _selectedNum.map(z=>{
          idArr.push(_supData[z]['id'])
        })
      }else{

        _selectedNum.map(z=>{
          console.log('page',z+(page-1)*13)
          idArr.push(_supData[z+(page-1)*13]['id'])
        })
      }

      console.log(idArr)
      let json = {
        voucherId:idArr.join(','),
        expire:rls
      }

      this.setState({loading:true});
      dispatch(action(json,this.state.searchOption)).then(e=>{
        if(e.payload){
          message.success(tips+this.state.selectedNum.length+" coupon success")
          this.setState({loading:false,selectedNum:[]});
        }else{
          message.error(e.error.message)
        }
      })
    }else{
      message.error(formatMessage({id:"selectOne"}))
    }

  }



  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }
  changePush=(e)=>{
    this.setState({pushInfomation:e.target.value})
  }

  handleCouponModal=()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        this.setState({load:true})
        values = {
          ...values,
          supplierusername:this.state.craftsInfo.account.username,
          startDt:this.state.start,
          endDt:this.state.end

        }
        console.log('value',values)
        this.setState({couponLoad:true})
        dispatch(newCoupons(values)).then(e=>{
          console.log(e)
          if(e.error){
            message.error(e.error.message)
            this.setState({couponLoad:false})
          }else{
            this.setState({couponLoad:false,couponModal:false})
            message.success(formatMessage({id:'save_ok'}))
          }
        })

      }
    });
  }
  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  };

  searchSupplier=(v)=>{
    let _step = ['searchReady'];
    if(this.state.formStep.length == 0){
      this.setState({formStep:_step})
    }
    this.setState({load:true});
    const {dispatch,supplierAccount}=this.props;
    let json={
      'account.username':v
    };
    dispatch(fetchSupplier(json)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({load:false})
      }else{
        this.setState({load:false})
      }
    });
  };

  render(){
    const {intl:{formatMessage},couponsManagement,location:{pathname},supplierAccount} = this.props;
    const {couponModal,category,currentPage} = this.state;
    console.log('pathname',pathname);
    const { loading } = this.state;






    const columns = [
      {dataIndex:_coupT.name_en},
      {dataIndex:_coupT.categoryIds},
      {dataIndex:_coupT.startDt,render:date=>formatDate(date)},
      {dataIndex:_coupT.endDt,render:date=>formatDate(date)},
      {dataIndex:_coupT.quantity},
      {dataIndex:_coupT.expire,render:(text,record)=>{
        return configCate(text,voucherStatus)
      }},
      {dataIndex:_coupT.wblists,render:(text,record)=>{
        let _r = record.toJS()
        if(_r.wblists.length>0){
          return _r.wblists[0].account.username
        }else{
          return ''
        }
      }},
      {dataIndex:_coupT.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/couponInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`coupons_${item.dataIndex}`}),
      })
    )

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



    const newCouponFormColumns = [


      {dataIndex:_coupD.name_en,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.name_en}`}))},
      {dataIndex:_coupD.description,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.description}`})),FormTag:
        <Input type="textarea" placeholder="Coupon description..." autosize={{ minRows: 2}} />
      },
      {dataIndex:_coupD.startDt,FormTag:
        <DatePicker onChange={(d,dt)=>{this.setState({start:dt})}} placeholder={formatMessage({id:'selectTime'})} />},
      {dataIndex:_coupD.endDt,FormTag:
        <DatePicker onChange={(d,dt)=>{this.setState({end:dt})}}  placeholder={formatMessage({id:'selectTime'})} />},
      {dataIndex:_coupD.quantity,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.quantity}`},'number'))},
      {dataIndex:_coupD.gtLimitation,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.gtLimitation}`},'number'))},
      {dataIndex:_coupD.value,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.value}`},'number'))},
      {dataIndex:_coupD.categoryIds,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.categoryIds}`})),FormTag:
        <Select onChange={(v)=>{this.setState({category:v})}} placeholder="Please select">
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
      {dataIndex:_coupD.code,option:this.getRequiredMessage(formatMessage({id:`coupon_${_coupD.code}`}))},
      {dataIndex:_coupD.supplierusername,FormTag:
        <Search
          placeholder="search supplier"
          style={{ width: 200 }}
          onSearch={this.searchSupplier}
        />},


    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`coupon_${item.dataIndex}`})
      })
    );

    const supplierColumns = [
      {dataIndex:_sup.cra_username,render:(text,record)=>{
        return record.getIn(['account','username'])
      }},

      {dataIndex:_sup.phoneNumber,render:(text,record)=>{
        return record.getIn(['account','mobile'])
      }},
      {dataIndex:_sup.supplierUsername},
      {dataIndex:_sup.createdAt,render:date=>formatDate(date)},
      {dataIndex:_sup.rlsStatus,render:(text,record)=>{
        return configDirectoryObject(text,rlsStatus)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`supplier_${item.dataIndex}`}),
      })
    )

    this.formColumns=[

      {dataIndex:'createdAt_between',type:'date'},
      {dataIndex:'type',placeholder:formatMessage({id:'select_coupons_type'}),type:'select',selectOption:productCate},
      {dataIndex:'option',placeholder:'option',type:'select',selectOption:['coupon name','supplier username']},
      {dataIndex:'keywords',formTag:'input'},
      {dataIndex:'couponStatus',placeholder:formatMessage({id:'select_coupons_status'}),type:'select',selectOption:couponsStatus}

    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    )

    let searchProps={
      formColumns:this.formColumns,
      onSave:this.onFetch,
      rightContent:this.getcontent()
    };

    const Selection = {
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedNum:selectedRowKeys});
        this.setState({selectedRows:selectedRows})
      },
    };
    const supplierSelection = {
      type:'radio',
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        let _form;

        if (this.state.formStep.length > 1) {

        } else {
          _form = this.state.formStep.concat(selectedRowKeys)
          this.setState({formStep: _form})
        }
        let craftsInfo = []
        let _Data = supplierAccount.toJS()
        let _selectedNum = selectedRowKeys
        let _page = currentPage;
        if (_page == 1) {
          _selectedNum.map(z=> {
            craftsInfo.push(_Data[z])
          })
        } else {
          _selectedNum.map(z=> {
            console.log('page', z + (_page - 1) * 13)
            craftsInfo.push(_Data[z + (_page - 1) * 13])
          })
        }
        let _crafts =craftsInfo[0];
        if(_crafts.categoryId !=="BEAUTY"){
          _crafts.subcategoryId = _crafts.categoryId
        }else{
          _crafts.subcategoryId = ""
        }

        this.setState({selectedRows: selectedRows, selectedNum: selectedRowKeys,});
        this.setState({craftsInfo: _crafts})
      }
    };

    return (

      <Row>
        <Title title={formatMessage({id:`${_tit.coupons_management}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updateCoupons,2,'Expire ')} style={{marginRight:'10px'}}>{formatMessage({id:'couponExpired'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCoupons,1,'Active ')} style={{marginRight:'10px'}}>{formatMessage({id:'couponActive'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCoupons,3,'Failure ')} style={{marginRight:'10px'}}>{formatMessage({id:'couponFailure'})}</Button>
          {/*<Button onClick={()=>{this.setState({pushModal:true})}} style={{marginRight:'10px'}}>{formatMessage({id:'groupPush'})}</Button>*/}
          {this.state.selectedNum.length>0 &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>

        <ImmutableTable
          loading={loading}
          rowSelection={Selection}
          style={{marginTop:20}}
          columns={columns}
          dataSource={couponsManagement}
          pagination={{ pageSize: 13,total:couponsManagement&&couponsManagement.size}}
          onChange={this.changeTable}
        />
        <Modal
          visible={couponModal}
          onCancel={()=>this.setState({couponModal:false})}
          title={formatMessage({id:'newCoupon'})}
          onOk={this.handleCouponModal}
          maskClosable={false}
          width={700}
          okText="Save"
          cancelText="Cancel"
        >
          <Spin  spinning={this.state.couponLoad} tip="creating..." >
            <Row>
              <SimpleForm columns={newCouponFormColumns}  colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
            </Row>
            {this.state.formStep.length!==0?<Row>
              {/*<Row style={{marginLeft:'10%'}}>{formatMessage({id:'selectCrafs'})}</Row>*/}
              <ImmutableTable
                loading={loading}
                rowSelection={supplierSelection}
                style={{marginTop:20}}
                columns={supplierColumns}
                dataSource={supplierAccount}
                pagination={{ pageSize: 6,total:supplierAccount&&supplierAccount.size,showQuickJumper:true }}
                onChange={this.changeTable}
              />
            </Row>:null}
          </Spin>
        </Modal>
      </Row>
    )

  }
}

CouponsManagementPage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  couponsManagement : state.getIn(['couponsManagement','couponsManagement']),
  supplierAccount : state.getIn(['supplierManagement','supplierAccount']),
});

export default injectIntl(connect(mapStateToProps)(CouponsManagementPage))


//const WrappedSystemUser = Form.create()();



