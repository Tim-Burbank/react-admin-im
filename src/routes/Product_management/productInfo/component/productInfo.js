
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,InputNumber } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../components/antd/Table'
import SimpleForm from '../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../components/title/title'
import {titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,proStatus,product_style,product_type,supplierDetails as _supd,gender,productDetails as _proD,product_subcategory,host,property,freezed} from '../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,configDirectoryObject,renderPic,configCate} from '../../../../utils/formatData'
import { fetchProductInfo, } from '../module/productInfo'
import {updateProduct} from '../../module/productManagement'
import {getFormRequired} from '../../../../utils/common'
const RadioGroup = Radio.Group;
const Option = Select.Option;



class ProductInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      load:false,
      visible:false,
      slideList:[],
      modalLoad:false,
      stepArr:[]
    }

  }
  componentWillMount(){
    const {dispatch,params} = this.props;

    if(params.id =='new'){
      this.setState({newPage:true})
    }else{
      this.setState({load:true})
      dispatch(fetchProductInfo(params.id,'get'))
      .then(e=>{
        if(e.payload){
          let _arr=[]
          e.payload.product_slide_pics.map(v=>{
              _arr.push({
              uid: v.picture,
              status: 'done',
              percent: 100,
              url: v.picture
            })
          });
          this.setState({load:false,slideList:_arr})
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


  findProperty=(v)=>{
    let _prop = []
    for(let p in v){
      if(p.substring(0,6) == 'steps-'){
        let _a={}
        _a['propertyId'] = 4;
        _a['order'] = p.substring(6,7)
        _a['content_en'] = v[p];
        _prop.push(_a)
      }
      for(let z in property){
        if(p == property[z]){
          let _a={}
          _a['propertyId'] = z;
          _a['content_en'] = v[p];
          _prop.push(_a)
        }
      }
    }
    return _prop
  }
  handleSave=()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        if(this.state.newPage){
          dispatch(fetchProductInfo('','post',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
            }else{
              message.success(formatMessage({id:'save_ok'}))
            }
          })
        }else{
          this.setState({modalLoad:true})
          values = {
            product:{
              ...values,
              product_slide_pics:this.state.slideListArr&&this.state.slideListArr.join(',')||this.pickPhotoUrl(this.state.slideList).join(','),
              name_en:values['name'],
              subcategoryId:configCate(values['subcategoryId'],product_subcategory),
              typeId:configCate(values['typeId'],product_type),
              styleId:configCate(values['styleId'],product_style),
              product_properties:this.findProperty(values)
            }
          }
          dispatch(fetchProductInfo(params.id,'put',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({modalLoad:false})
            }else{
              this.setState({modalLoad:false,load:true,visible:false})
              dispatch(fetchProductInfo(params.id,'get')).then(e=>{
                if(e.error){
                  message.error(e.error.message)
                }else{
                  this.setState({load:false})
                  message.success(formatMessage({id:'modify_ok'}))
                }
              })
            }
          })
        }
        //新增或编辑

      }
    });
  }

  updateUserRls = (rls,tips) => {
    const {dispatch,params,intl:{formatMessage}} = this.props;
    let values = {
        product:{
          userRls:rls
        }
      };
    this.setState({load:true});
    dispatch(fetchProductInfo(params.id,'put',values)).then(e=>{
      console.log(e)
      if(e.error){
        message.error(e.error.message)
      }else{
        dispatch(fetchProductInfo(params.id,'get')).then(e=>{
          if(e.error){
            this.setState({load:false})
            message.error(e.error.message)
          }else{
            this.setState({load:false})
            message.success(tips+ " account success")
          }
        })
      }
    })
  }

  beforeUpload=(file)=> {
    const isJPG = file.type === 'image/jpeg'||file.type ==='image/png';
    if (!isJPG) {
      message.error('You can only upload JPG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    return isJPG && isLt2M;
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }


  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  };
  handleModify=()=>{
    this.setState({visible:true})
  }

  handleAccount=(action,rls,tips,type,status)=>{
    this.setState({loading:true});
    const {dispatch,productInfo,params} = this.props

    let json = {
      productId:productInfo.get('id'),
    };
    json[status] = rls

    this.setState({load:true})
    dispatch(action(json,params.id,type))
      .then(e=>{
        console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({load:false});
        }else{
          message.success(tips+" product success")
          this.setState({load:false});
        }
      })
  }

  handleSlideChange = (file) =>{
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
    this.setState({slideListArr:fileArr,slideList:file.fileList})
  };



  render(){
    const {intl:{formatMessage},productInfo,location:{pathname},params} = this.props;
    const {previewVisible ,previewImage,newPage,visible ,slideList,stepArr} = this.state
    const column = [
      {dataIndex:_proD.id},
      {dataIndex:_proD.product_slide_pics,col:'24',render:renderPic},
      {dataIndex:_proD.adminRls,trans:configDirectoryObject,config:freezed,bold:true},
      {dataIndex:_proD.userRls,trans:configDirectoryObject,config:proStatus,bold:true},
      {dataIndex:_proD.name},
      {dataIndex:_proD.categoryId},
      {dataIndex:_proD.typeId,renderType:true},
      {dataIndex:_proD.product_styles,renderStyle:true},
      {dataIndex:_proD.originPrice,render:formatMoney},
      {dataIndex:_proD.currentPrice,bold:true,render:formatMoney},
      {dataIndex:_proD.description},
      {dataIndex:_proD.timeCost},
      {dataIndex:_proD.duration},
      {dataIndex:_proD.url},
    ]

    const spaColumn = [
      {dataIndex:_proD.id},
      {dataIndex:_proD.product_slide_pics,col:'24',render:renderPic},
      {dataIndex:_proD.adminRls,trans:configDirectoryObject,config:freezed,bold:true},
      {dataIndex:_proD.userRls,trans:configDirectoryObject,config:proStatus,bold:true},
      {dataIndex:_proD.name},
      {dataIndex:_proD.categoryId},
      {dataIndex:_proD.typeId,renderType:true},
      {dataIndex:_proD.originPrice,render:formatMoney},
      {dataIndex:_proD.currentPrice,bold:true,render:formatMoney},
      {dataIndex:_proD.product_properties,renders:true,boldTitle:true},
      {dataIndex:_proD.description},
      {dataIndex:_proD.timeCost},
      {dataIndex:_proD.duration},
      {dataIndex:_proD.url},
    ]

    const beautyColumn = [
      {dataIndex:_proD.id},
      {dataIndex:_proD.product_slide_pics,col:'24',render:renderPic},
      {dataIndex:_proD.adminRls,trans:configDirectoryObject,config:freezed,bold:true},
      {dataIndex:_proD.userRls,trans:configDirectoryObject,config:proStatus,bold:true},
      {dataIndex:_proD.name},
      {dataIndex:_proD.categoryId},
      {dataIndex:_proD.subcategoryId,trans:configCate,config:product_subcategory},
      {dataIndex:_proD.typeId,renderType:true},
      {dataIndex:_proD.product_styles,renderStyle:true},
      {dataIndex:_proD.originPrice,render:formatMoney},
      {dataIndex:_proD.currentPrice,bold:true,render:formatMoney},
      {dataIndex:_proD.product_properties,renders:true,boldTitle:true},
      {dataIndex:_proD.description},
      {dataIndex:_proD.timeCost},
      {dataIndex:_proD.duration},
      {dataIndex:_proD.url},
    ]

    const renderOption = (cate,config,key) =>{
      let _opt=[]
      for(let v in config){
        if(cate == config[v][key]){
          _opt.push(config[v]['name_en'])
        }
      }

      return _opt.map((v,i)=>(
        <Option key={i} value={v}>{v}</Option>
      ))
    };
    const formColumns = [
      {dataIndex:_proD.product_slide_pics,FormTag:
        <Upload
          listType="picture-card"
          action={`${host}/upload`}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleSlideChange}
          fileList={slideList}
          name='fileUpload'
        >
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>},
      {dataIndex:_proD.name},
      {dataIndex:_proD.categoryId,props:{disabled:true}},
      {dataIndex:_proD.typeId,FormTag:
        <Select disabled={productInfo&&productInfo.get('categoryId') == 'SPA'} placeholder="Please select">
          {renderOption(productInfo&&productInfo.get('subcategoryId'),product_type,'subcategoryId')}
        </Select>},
      {dataIndex:_proD.styleId,FormTag:
        <Select mode="multiple" placeholder="Please select" >
          {renderOption(productInfo&&productInfo.get('categoryId'),product_style,'categoryId')}
        </Select>},

      {dataIndex:_proD.originPrice,FormTag:
        <InputNumber
        min={0}
        step={1000}
        formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.toString().replace(/\$\s?|(,*)/g, '')}
        style={{width:418}}
        />},
      {dataIndex:_proD.currentPrice,FormTag:
        <InputNumber
          min={0}
          step={1000}
          formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.toString().replace(/\$\s?|(,*)/g, '')}
          style={{width:418}}
        />},
      {dataIndex:_proD.description},
      {dataIndex:_proD.timeCost},
      {dataIndex:_proD.duration},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`productDetail_${item.dataIndex}`})
      })
    );


    const beautyFormColumns = [
      {dataIndex:_proD.product_slide_pics,FormTag:
        <Upload
          listType="picture-card"
          action={`${host}/upload`}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleSlideChange}
          fileList={slideList}
          name='fileUpload'
        >
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>},
      {dataIndex:_proD.name},
      {dataIndex:_proD.categoryId,props:{disabled:true}},
      {dataIndex:_proD.subcategoryId,FormTag:
        <Select  placeholder="Please select">
          {renderOption(productInfo&&productInfo.get('categoryId'),product_subcategory,'categoryId')}
        </Select>
      },
      {dataIndex:_proD.typeId,FormTag:
        <Select  placeholder="Please select">
          {renderOption(productInfo&&productInfo.get('subcategoryId'),product_type,'subcategoryId')}
        </Select>},
      {dataIndex:_proD.styleId,FormTag:
        <Select  placeholder="Please select" >
          {renderOption(productInfo&&productInfo.get('categoryId'),product_style,'categoryId')}
        </Select>},
      {dataIndex:_proD.originPrice,FormTag:
        <InputNumber
          min={0}
          step={1000}
          formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.toString().replace(/\$\s?|(,*)/g, '')}
          style={{width:418}}
        />},
      {dataIndex:_proD.currentPrice,FormTag:
        <InputNumber
          min={0}
          step={1000}
          formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.toString().replace(/\$\s?|(,*)/g, '')}
          style={{width:418}}
        />},
      {dataIndex:_proD.description},
      {dataIndex:_proD.timeCost},
      {dataIndex:_proD.duration},
      {dataIndex:_proD.color},
      {dataIndex:_proD.brand},
      {dataIndex:_proD.section},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`productDetail_${item.dataIndex}`})
      })
    );


    const spaFormColumns = [
      {dataIndex:_proD.product_slide_pics,FormTag:
        <Upload
          listType="picture-card"
          action={`${host}/upload`}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleSlideChange}
          fileList={slideList}
          name='fileUpload'
        >
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>},
      {dataIndex:_proD.name},
      {dataIndex:_proD.categoryId,props:{disabled:true}},
      {dataIndex:_proD.typeId,FormTag:
        <Select placeholder="Please select">
          {renderOption(productInfo&&productInfo.get('subcategoryId'),product_type,'subcategoryId')}
        </Select>},
      {dataIndex:_proD.originPrice,FormTag:
        <InputNumber
          min={0}
          step={1000}
          formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.toString().replace(/\$\s?|(,*)/g, '')}
          style={{width:418}}
        />},
      {dataIndex:_proD.currentPrice,FormTag:
        <InputNumber
          min={0}
          step={1000}
          formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.toString().replace(/\$\s?|(,*)/g, '')}
          style={{width:418}}
        />},
      {dataIndex:_proD.description},
      {dataIndex:_proD.timeCost},
      {dataIndex:_proD.duration},
      {dataIndex:_proD.suitable},
      {dataIndex:_proD.position},
      {dataIndex:_proD.effect},
      {dataIndex:_proD.note},
      {dataIndex:_proD.step,show:'step'},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`productDetail_${item.dataIndex}`})
      })
    )

    const renderForm=(v,column)=>{
      if(v == 0){
        if(column.trans) {
          return column.trans(v, column.config)
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
          if(item.property.name !== 'STEP'){
             return (
               <Col key={index}>
                 <i>{item.property.name} </i>
                 <span>: {item.content}</span>
               </Col>
             )
          }else{
            return (
              <Col key={index}>
                  <i>STEP {item.order} </i>
                  <span>: {item.content}</span>
              </Col>
            )
          }
          })
      }else if(column.render){
        return column.render(v)
      }else if(column.renderStyle){
        let _v = v.toJS();
        let _styleArr=[]
        _v.map((item,index)=>{
          _styleArr.push(item.style.name)
        })
        return _styleArr.join(',')
      }else if(column.renderType){
        for(let z in product_type){
          if(z == v){
            return product_type[z]['name_en']
          }
        }
      }else{
        return v
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }

    const renderColumns=()=>{
      if(productInfo&&productInfo.get('categoryId') == 'BEAUTY'){
        return beautyFormColumns
      }else if(productInfo&&productInfo.get('categoryId') == 'SPA'){
        return spaFormColumns
      }else{
        return formColumns
      }
    };

    const renderForms=()=>{
      if(productInfo&&productInfo.get('categoryId') == 'BEAUTY'){
        return beautyColumn.map(columnMap)
      }else if(productInfo&&productInfo.get('categoryId') == 'SPA'){
        return spaColumn.map(columnMap)
      }else{
        return column.map(columnMap)
      }
    };


    const counterStep=()=>{
      if(productInfo){
        let _p=productInfo.toJS();
        let conter=[]
        _p.product_properties.map((v,i)=>{
          if(v.property.name == 'step'){
            conter.push(v)
          }
        })
        return conter
      }
    }
    const columnMap=column=>{

      let text
      if(productInfo){
        text=column.deep?productInfo.getIn(column.deep):productInfo.get(column.dataIndex)
      }else{
        text= ''
      }
      console.log('text',text)
      let bold = column.bold
      let boldTitle = column.boldTitle
      return (
        <Col key={column.dataIndex} span={column.col || 24 } className='payment-item'>
          <span className="payment-label" style={{marginBottom:'5px',fontWeight:'bold'}}  >{formatMessage({id:`productDetail_${column.dataIndex}`})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}}>{
            renderForm(text,column)
          }</span>
        </Col>
      )};

    return (

      <Row>
        <Title title={formatMessage({id:`${_tit.product_detail}`})} />
        <Spin spinning={this.state.load} tip="Loading..." >
          <Row type="flex" justify="end" style={{marginTop:"20px",marginBottom:'20px'}}>
            <Button onClick={this.handleAccount.bind(this,updateProduct.stop,0,'Stop ',2,'adminRls')} style={{marginRight:'10px'}}>{formatMessage({id:'stop'})}</Button>
            <Button onClick={this.handleAccount.bind(this,updateProduct.active,1,'Active ',2,'adminRls')} style={{marginRight:'10px'}}>{formatMessage({id:'active'})}</Button>
            <Button onClick={this.updateUserRls.bind(this,0,'Public')} style={{marginRight:'10px'}}>{formatMessage({id:'product_unpublic'})}</Button>
            <Button onClick={this.updateUserRls.bind(this,1,'Unpublic')} style={{marginRight:'10px'}}>{formatMessage({id:'product_public'})}</Button>
          </Row>
          {/*<Row style={{marginLeft:'50px',marginRight:'50px'}}>
            <p style={{fontWeight:'bold',marginBottom:'10px'}}>Product photos</p>
            <Row>
              <Upload
                listType="picture-card"
                action="//jsonplaceholder.typicode.com/posts/"
                beforeUpload={this.beforeUpload}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>
              </Upload>
            </Row>
          </Row>*/}
          {!newPage&&<Row className="payment-read">

            {renderForms()}
          </Row>}
          {/*newPage&&
           <Row>
           <SimpleForm columns={newFormColumns}  colSpan={12} labelCol={{span:5}} ref={f=>this.form=f} />
           </Row>*/}
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Modal
            title={formatMessage({id:'customer_edit'})}
            visible={visible}
            onCancel={()=>this.setState({visible:false})}
            maskClosable={false}
            onOk={this.handleSave}
            width={750}
            okText="Save"
            cancelText="Cancel"
          >
            <Spin spinning={this.state.modalLoad} tip="Saving...">
              <Row>
                <SimpleForm columns={renderColumns()} initial={productInfo} stepArr={counterStep()||[]} colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
              </Row>
            </Spin>
          </Modal>
          <Row type="flex" justify="center" style={{marginTop:"20px",marginBottom:'20px'}}>
            <Button onClick={this.handleModify}   type="primary" size="large">{formatMessage({id:'modify'})}</Button>
          </Row>
        </Spin>
      </Row>
    )
  }
}



ProductInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

export default injectIntl(ProductInfoPage)


