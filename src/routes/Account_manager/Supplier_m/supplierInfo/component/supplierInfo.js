/**
 * Created by Yurek on 2017/5/17.
 */
/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,DatePicker } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../../components/antd/Table'
import SimpleForm from '../../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../../components/title/title'
import {titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,rlsStatus,supplierDetails as _supd,gender,host} from '../../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../../utils/formatData'
import { fetchSupplierInfo,changePassword } from '../modules/supplierInfo'
import {fetchSupplier,updateSupplier} from '../../module/supplierManagement'
import {getFormRequired} from '../../../../../utils/common'
import './supplierInfo.scss'
const RadioGroup = Radio.Group;
const Option = Select.Option;







class SupplierInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      fileList:[],
      portraitList:[],
      fileList2:[],
      load:false,
      passModal:false,
      passLoad:null,
    }
  }

  componentWillMount(){
    const {dispatch,params} = this.props;
    if(params.id =='new'){
      this.setState({newPage:true})
    }else{
      this.setState({load:true})
      dispatch(fetchSupplierInfo(params.id,'get'))
        .then(e=>{
          let _Arr=[];
          let _arr2 = [];
          let _arr3 = [];
          console.log('e',e)
          if(e.payload){
            for( let p in e.payload.warranty){
              if(p == 'idPhoto'){
                e.payload.warranty[p].map(v=>{
                  _arr2.push({
                    uid: v,
                    status: 'done',
                    percent: 100,
                    url: v
                  })
                })
              }else{
                e.payload.warranty[p].map(v=>{
                  _arr3.push({
                    uid: v,
                    status: 'done',
                    percent: 100,
                    url: v
                  })
                })
              }
            }
            _Arr.push({
                  uid: e.payload.portrait,
                  status: 'done',
                  percent: 100,
                  url: e.payload.portrait,
                });
            this.setState({portraitList:e.payload.portrait?_Arr:[],fileList:_arr2,fileList2:_arr3})
            this.setState({load:false})
          }else{
            message.error(e.error.message);
          }
        })
    }
  }


  pickPhotoUrl = (arr) => {
    let _arr=[];
    arr.map(v=>{
      _arr.push(v.url)
    })
    return _arr
  }

  handleAccount=(action,rls,tips,type)=>{
    this.setState({loading:true});
    const {dispatch,supplierInfo,params} = this.props

    let json = {
      ids:supplierInfo.get('id'),
      rlsStatus:rls
    }
    this.setState({load:true})
    dispatch(action(json,params.id,type))
      .then(e=>{
        console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({load:false});
        }else{
          message.success(tips+" account success")
          this.setState({load:false});
        }
      })

  }

  handleSave=()=>{

    const {dispatch,params,intl:{formatMessage}} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        if(this.state.newPage){
          values = {
            ...values,
            gender:values.gender=='male'?0:1,
            type:2,
            'supplier.type':values.type,
            portrait:this.state.portrait,
            warranty:{
              idPhoto:this.state.fileListArr||this.pickPhotoUrl(this.state.fileList),
              guaranteePhoto:this.state.fileList2Arr||this.pickPhotoUrl(this.state.fileList2)
            }
          };
          this.setState({load:true})
          dispatch(fetchSupplierInfo('','post',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({load:false})
            }else{
              message.success(formatMessage({id:'save_ok'}))
              this.setState({load:false})
            }
          })
        }else{
          values = {
            ...values,
            gender:values.gender=='male'?0:1,
            type:undefined,
            'supplier.type':isNaN(values.type)?configDirectoryObject(values.type,supplierShowType):values.type,
            portrait:this.state.portrait,
            warranty:{
              idPhoto:this.state.fileListArr||this.pickPhotoUrl(this.state.fileList),
              guaranteePhoto:this.state.fileList2Arr||this.pickPhotoUrl(this.state.fileList2)
            }
          };
          this.setState({load:true})
          dispatch(fetchSupplierInfo(params.id,'put',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({load:false})
            }else{
              dispatch(fetchSupplierInfo(params.id,'get'))
              message.success(formatMessage({id:'modify_ok'}))
              this.setState({load:false})
            }
          })
        }
      }
    });
  }

  beforeUpload=(file)=> {
  const isJPG = file.type === 'image/jpeg'||file.type ==='image/png';
  if (!isJPG) {
    message.error('You can only upload JPG or PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024/1024 < 5;
  if (!isLt2M) {
    message.error('Image must smaller than 500k!');
  }
  return isJPG && isLt2M;
}

  handleCancel = () => this.setState({ previewVisible: false });

  handlePassModal = () => {
    const {fpassword,lpassword} = this.state
    const {dispatch,supplierInfo,intl:{formatMessage}} = this.props

    let json = {
      id:supplierInfo.get('id'),
      password:lpassword
    }
    if(fpassword === lpassword&&fpassword ){
      this.setState({passLoad:true})
        dispatch(changePassword(json)).then(e=>{
          if(e.payload){
            this.setState({passLoad:false})
            message.success(formatMessage({id:'changePasswordSuccess'}));
            this.setState({ passModal: false,fpassword:null,lpassword:null })
          }else{
            this.setState({passLoad:false,fpassword:null,lpassword:null})
            message.error(e.error.message)
          }
        })
    }else{
      message.error(formatMessage({id:'passwordFailed'}));
    }

  };

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handlePortraitChange = (file) =>{
    console.log(file)
    file.fileList.map(v=>{
      if(v.status=='done'){
        if(v.response){
          this.setState({portrait:v.response.Location})
        }
      }
    });
    this.setState({portraitList:file.fileList})
  };

  handleGaPhotoChange = (file) =>{
    console.log(file)
    let fileArr = [];
    file.fileList.map(v=>{
      if(v.status=='done'){
        if(v.response){
          fileArr.push(v.response.Location)
        }else{
          fileArr.push(v.url)
        }
      }
    });
    this.setState({fileList2Arr:fileArr,fileList2:file.fileList})
  };

  handleIdPhotoChange = (file) =>{
    console.log(file)
    let fileArr = [];
    file.fileList.map(v=>{
      if(v.status=='done'){
        if(v.response){
          fileArr.push(v.response.Location)
        }else{
          fileArr.push(v.url)
        }
      }
    });
    this.setState({fileListArr:fileArr,fileList:file.fileList})
  };

  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  };

  changePassword=()=>{
    this.setState({passModal:'true'})
  }


  stopAccount=()=>{
    this.setState({load:true});
    const {dispatch,supplierInfo,params} = this.props

    let json = {
      ids:supplierInfo.get('id'),
      rlsStatus:10
    }
    dispatch(updateSupplier(json)).then(e=>{
      if(e.payload){
        dispatch(fetchSupplierInfo(params.id,'get')).then(e=>{
          if(e.payload){
            this.setState({load:false});
            message.success("Stop account success")
          }else{
            message.error(e.error.message);
          }
        })

      }
    })
  }
  activeAcc=()=>{
    this.setState({load:true});
    const {dispatch,supplierInfo,params} = this.props

    let json = {
      ids:supplierInfo.get('id'),
      rlsStatus:1
    }
    dispatch(updateSupplier(json)).then(e=>{
      if(e.payload){
        dispatch(fetchSupplierInfo(params.id,'get')).then(e=>{
          if(e.payload){
            this.setState({load:false});
            message.success("Active account success")
          }else{
            message.error(e.error.message);
          }
        })

      }
    })
  };

  changePass=(e)=>{
    console.log('password',e.target.value)
    this.setState({fpassword:e.target.value})
  }

  changePassAgain=(e)=>{
    console.log('lpassword',e.target.value)
    this.setState({lpassword:e.target.value})
  }
  render(){
    const {intl:{formatMessage},supplierInfo,location:{pathname},params} = this.props;
    const {previewVisible ,previewImage,newPage,fileList,portrait,fileList2,portraitList ,passModal,fpassword,lpassword} = this.state
    const column = [
      {dataIndex:_supd.username,deep:['account','username']},
      {dataIndex:_supd.createdAt},
      {dataIndex:_supd.rlsStatus,trans:configDirectoryObject,config:rlsStatus,bold:true},

    ];



    const renderForm=(v,column)=>{
      console.log('form',v)

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
      }else if(column.renders){
        let _v = v.toJS();
        console.log('_v',_v);
        return _v.map((item,index)=>{
          if(item.name !== 'step'){
            return (
              <Col key={index}>
                <span>{item.name}: </span>
                <span>{item.content}</span>
              </Col>
            )
          }else{
            return (
              <Col key={index}>
                <span>Step{item.order}. </span>
                <span>{item.content}</span>
              </Col>
            )
          }
        })
      } else{
        return v
      }
    }



    const formColumns = [
      {dataIndex:_supd.name,option:this.getRequiredMessage(formatMessage({id:'name'}))},
      {dataIndex:_supd.type,option:this.getRequiredMessage(formatMessage({id:'type'})),FormTag:<Select>
      {Object.entries(supplierShowType).map(type=><Option  key={type[0]} value={type[0]}>{formatMessage({id:`supplier_${type[0]}`})}</Option>)}
    </Select>},
      {dataIndex:_supd.shopName,option:this.getRequiredMessage(formatMessage({id:'name'}))},
      {dataIndex:_supd.mobile,option:this.state.newPage?this.getRequiredMessage(formatMessage({id:'mobile'})):''},
      {dataIndex:_supd.identityCard,option:this.state.newPage?this.getRequiredMessage(formatMessage({id:'identityCard'})):''},
      {dataIndex:_supd.email,option:this.getRequiredMessage(formatMessage({id:'email'}))},
      {dataIndex:_supd.skills,option:this.getRequiredMessage(formatMessage({id:'skills'}))},
      {dataIndex:_supd.gender,option:this.getRequiredMessage(formatMessage({id:'gender'})),
        FormTag:<RadioGroup>
          {Object.keys(gender).map(type=><Radio  key={type} value={type}>{formatMessage({id:type})}</Radio>)}
        </RadioGroup>},
      {dataIndex:_supd.birthday,
        FormTag:<DatePicker placeholder="Select month" format="YYYY-MM-DD"/>


      },
      {dataIndex:_supd.address,option:this.getRequiredMessage(formatMessage({id:'address'}))},
      {dataIndex:_supd.cardId,option:this.state.newPage?this.getRequiredMessage(formatMessage({id:'cardId'})):''},
      {dataIndex:_supd.education,option:this.getRequiredMessage(formatMessage({id:'education'}))},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex})
      })
    );



    const newFormColumns = [
      {dataIndex:_supd.username,option:this.getRequiredMessage(formatMessage({id:'username'}))},
      {dataIndex:_supd.password,option:this.getRequiredMessage(formatMessage({id:'password'}))},
      ...formColumns,
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex})
      })
    );


    const columnMap=column=>{
      console.log(supplierInfo)
      let bold = column.bold
      let text
      if(supplierInfo){
        text=column.deep?supplierInfo.getIn(column.deep):supplierInfo.get(column.dataIndex)
      }else{
        text= ''
      }
      return (
        <Col key={column.dataIndex} span={column.span || 6 } className='payment-item'>
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:column.dataIndex})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}}>{
            renderForm(text,column)
          }</span>
        </Col>
      )};
    return (
      <Row>
        <Title title={newPage?formatMessage({id:`${_tit.new_supplier}`}):formatMessage({id:`${_tit.supplier_detail}`})} />
        {!newPage&&<Row type="flex" justify="end" style={{marginTop:"20px",marginBottom:'20px'}}>
          <Button  onClick={this.changePassword} style={{marginRight:"10px"}} >{formatMessage({id:'changePassword'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateSupplier.stop,10,'Stop ',2)} type="danger" style={{marginRight:'10px'}}>{formatMessage({id:'supplier_stopAc'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateSupplier.active,1,'Active ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_actAc'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateSupplier.check,3,'Peeding ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_peedAc'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateSupplier.disapprove,0,'Disapprove ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_notApp'})}</Button>
        </Row>}
        <Spin  spinning={this.state.load} tip="Loading..." >
        {!newPage&&<Row className="payment-read" style={{marginBottom:'20px'}}>
          {column.map(columnMap)}
        </Row>}
        <Row style={{marginTop:20}}>
          <SimpleForm columns={newPage?newFormColumns:formColumns} initial={this.state.newPage?Immutable.fromJS({}):supplierInfo} colSpan={12} labelCol={{span:5}} ref={f=>this.form=f} />
        </Row>
        {/*newPage&&
        <Row>
          <SimpleForm columns={newFormColumns}  colSpan={12} labelCol={{span:5}} ref={f=>this.form=f} />
        </Row>*/}


        {!newPage &&<Row type="flex" justify="center">
          <Row style={{width:'80%'}}>
            <Row gutter={120} >
              <Col span='12' style={{textAlign:'end'}}>
                <span style={{fontWeight:'bold'}}>{formatMessage({id:'crafts_tab'})}</span>
                <span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}}>{supplierInfo&&supplierInfo.get('totalCraftsmans')}</span>
                {supplierInfo&&supplierInfo.get('totalCraftsmans') !== 0?<Link to={{pathname:'/craftsman_management',query:{supplierUsername:supplierInfo&&supplierInfo.getIn(['account','username'])}}}>
                  {formatMessage({id:"view"})}
                </Link>:null}
              </Col>
              <Col span='12'>
                <span style={{fontWeight:'bold'}} >{formatMessage({id:'record_tab'})}</span><span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}} />
                {supplierInfo&&<Link to={{pathname:'/supplier_finance/supplierFinanceInfo/'+supplierInfo.get('accountId')}}>
                  {formatMessage({id:"view"})}
                </Link>}
              </Col>
            </Row>
            <Row gutter={120} >
              <Col span='12' style={{textAlign:'end'}}>
                <span style={{fontWeight:'bold'}}>{formatMessage({id:'product_tab'})}</span>
                <span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}}>{supplierInfo&&supplierInfo.get('totalProducts')}</span>
                {supplierInfo&&supplierInfo.get('totalProducts') !== 0?<Link to={{pathname:'/product_management',query:{supplierUsername:supplierInfo&&supplierInfo.getIn(['account','username'])}}}>
                  {formatMessage({id:"view"})}
                </Link>:null}
              </Col>
              <Col span='12' >
                <span style={{fontWeight:'bold'}}>{formatMessage({id:'order_tab'})}</span>
                <span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}}>{supplierInfo&&supplierInfo.get('totalOrders')}</span>
                {supplierInfo&&supplierInfo.get('totalOrders') !== 0?<Link to={{pathname:'/order_management',query:{'supplier.account.username':supplierInfo&&supplierInfo.getIn(['account','username'])}}}>
                  {formatMessage({id:"view"})}
                </Link>:null}
              </Col>
            </Row>
          </Row>
        </Row>}
        {<Row style={{marginLeft:'50px',marginRight:'50px',marginTop:'50px'}}>
        <p style={{fontWeight:'bold',marginBottom:'10px'}}>Upload your personal photo</p>
        <Row>
          <Upload
            listType="picture-card"
            action={`${host}/upload`}
            beforeUpload={this.beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handlePortraitChange}
            fileList={portraitList}
            name='fileUpload'
          >
            {portraitList.length >= 1 ? null:<div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>}
          </Upload>
        </Row>
        <p style={{fontWeight:'bold',marginBottom:'10px'}}>Upload your ID photo</p>
        <Row>
          <Upload
            listType="picture-card"
            action={`${host}/upload`}
            beforeUpload={this.beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleIdPhotoChange}
            fileList={fileList}
            name='fileUpload'
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          </Upload>
        </Row>
        <p style={{fontWeight:'bold',marginBottom:'10px'}}>Upload your guarantee photo</p>
        <Row>
          <Upload
            listType="picture-card"
            action={`${host}/upload`}
            beforeUpload={this.beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleGaPhotoChange}
            fileList={fileList2}
            name='fileUpload'
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          </Upload>
        </Row>
        </Row>}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Row type="flex" justify="center" style={{marginTop:"20px"}}>
          <Button onClick={this.handleSave}  type="primary" size="large">{formatMessage({id:'save'})}</Button>
        </Row>
          </Spin>
        <Modal
          visible={passModal}
          onCancel={()=>this.setState({passModal:false,fpassword:null,lpassword:null})}
          title={formatMessage({id:'changePassword'})}
          onOk={this.handlePassModal}
          maskClosable={false}
          okText="Save"
          cancelText="Cancel"
        >
          <Spin  spinning={this.state.passLoad} tip="Saving..." >
            <Row>
              <Col span="6">
                <span>{formatMessage({id:'newPassword'})}</span>
              </Col>
              <Col span="18">
                <Input placeholder={formatMessage({id:'inputNewPassword'})}  value={fpassword}onChange={this.changePass} type="password" />
              </Col>
            </Row>
            <Row style={{marginTop:'7px'}}>
              <Col span="6">
                <span>{formatMessage({id:'inputAgain'})}</span>
              </Col>
              <Col span="18">
                <Input placeholder={formatMessage({id:'inputNewPasswordAgain'})} value={lpassword} onChange={this.changePassAgain} type="password" />
              </Col>
            </Row>
          </Spin>
        </Modal>
      </Row>
    )
  }
}





SupplierInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

export default injectIntl(SupplierInfoPage)


