/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Modal,Col,Input,Menu,Upload ,Radio,Icon  } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../components/antd/Table'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import { pathJump,takeId } from '../../../utils/'
import TopSearch from '../../../components/search/topSearch'
import Title from '../../../components/title/title'
import {host,rec_position,financeTableField as _finT,financeStatusArr,financeStatus,withdrawStatus,transactionStatus,withdrawTableField as _witT , titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,rlsStatus} from '../../../config'
import Immutable from 'immutable'
import {fetchRecommed,updateRecommend,newRecommend,delRecommend} from '../module/recommendPosition'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../utils/formatData'
const RadioGroup = Radio.Group;




class RecommendPosition extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      current: 'home',
      modal:false,
      modalLoad:false,
      portraitList:[],
      rec_info:null,
      position:null,
      hideId:true,
      proId:true,
      craId:false,
      radio_cra:null,
      delBtn:true
    }
  }


  componentWillMount(){
    const {dispatch,params,location} = this.props;
      this.setState({load:true});
    let json = {
      page:0,
      areaNumber:7
    }
      dispatch(fetchRecommed(json)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
          this.setState({load:false})
        }else{
          this.setState({load:false})
        }
      });
  }

  handleClick = (e) => {
    const {dispatch,params,location} = this.props;
    console.log('click ', e);
    this.setState({load:true});
    this.setState({
      current: e.key,
    });
    let json
    if(e.key == 'home'){
       json = {
        page:0,
        areaNumber:7
      }
    }else if(e.key == 'top_cra'){
      json = {
        page:1,
        areaNumber:1
      }
    }else{
      json = {
        page:2,
        areaNumber:1
      }
    }
    dispatch(fetchRecommed(json)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({load:false})
      }else{
        this.setState({load:false})
      }
    });
  }

  handleModal=()=>{
    const {radio,rec_info,portrait,radio_url,radio_pro,current,radio_cra} = this.state;
    const {dispatch} = this.props;
    let json
    let option

    if(current == 'home'){
      option = {
        page:0,
        areaNumber:7
      }
    }else if(current == 'top_cra'){
      option = {
        page:1,
        areaNumber:1
      }
    }else{
      option = {
        page:2,
        areaNumber:1
      }
    }


    if(rec_info !== null){
      if(radio_cra !== null){
        json={
          page:option.page,
          area:this.state.position,
          craftsmanId:radio_cra,
        }
      }else{
        if(radio == 1){
          json = {
            page:rec_info.page,
            area:rec_info.area,
            picture:portrait,
            link:radio_url
          }
        }else{
          json = {
            page:rec_info.page,
            area:rec_info.area,
            productId:radio_pro,
            picture:portrait,
          }
        }
      }


      this.setState({modalLoad:true,load:true})
      dispatch(updateRecommend(rec_info.id,json)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
          this.setState({modalLoad:false,rec_info:null,position:null,portraitList:[],modal:false,load:false,portrait:null})
        }else{
          this.setState({modalLoad:false,rec_info:null,position:null,portraitList:[],modal:false,portrait:null})
          dispatch(fetchRecommed(option)).then((e)=>{
            if(e.error){
              message.error(e.error.message);
              this.setState({load:false})
            }else{
              this.setState({load:false})
            }
          })
        }
      });
    }else{
      if(radio_cra !== null){
        json={
          page:option.page,
          area:this.state.position,
          craftsmanId:radio_cra,
        }
      }else{
        if(radio == 1){
          json = {
            page:option.page,
            area:this.state.position,
            picture:portrait,
            link:radio_url
          }
        }else{
          json = {
            page:option.page,
            area:this.state.position,
            productId:radio_pro,
            picture:portrait,
          }
        }
      }


      this.setState({modalLoad:true,load:true})
      dispatch(newRecommend(json,option)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
          this.setState({modalLoad:false,rec_info:null,position:null,portraitList:[],modal:false,load:false,portrait:null,radio_cra:null})
        }else{
          this.setState({modalLoad:false,rec_info:null,position:null,portraitList:[],modal:false,portrait:null,radio_cra:null})
          dispatch(fetchRecommed(option)).then((e)=>{
            if(e.error){
              message.error(e.error.message);
              this.setState({load:false})
            }else{
              this.setState({load:false})
            }
          })
        }
      });
    }



  }

  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      radio: e.target.value,
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
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  openModal=(x,type)=>{
    let arr = [];
    if(type == 'new'){
      this.setState({
        delBtn:false,
        radio:null,
        position:x,
        modal:true,
        radio_url:null,
        radio_pro:null,
        radio_cra:null,
        hideId:x=='a1'||x=='a2',
        craId:x =='a7',
        proId:x !=='a7',
      })
    }else{
      if(x.picture){
        arr.push({
          uid: x.picture,
          status: 'done',
          percent: 100,
          url: x.picture,
        });
      }else if(x.product){
        arr.push({
          uid: x.product.product_slide_pics[0].picture,
          status: 'done',
          percent: 100,
          url: x.product.product_slide_pics[0].picture,
        });
      }else{
        arr.push({
          uid: x.craftsman.portrait,
          status: 'done',
          percent: 100,
          url: x.craftsman.portrait,
        });
      }



      this.setState({modalLoad:true})
      this.setState({
        delBtn:true,
        hideId:x.area=='a1'||x.area=='a2',
        craId:x.area =='a7',
        proId:x.area !=='a7',
        rec_info:x,
        portraitList:arr,
        radio:x.product?2:1,
        radio_url:x.link?x.link:'',
        radio_pro:x.product?x.product.id:'',
        radio_cra:x.craftsmanId?x.craftsmanId:'',
        modal:true
      })
      this.setState({modalLoad:false})
    }


  }


  handleCancel = () => this.setState({ previewVisible: false });

  del = () => {
    const {dispatch} = this.props;
    const {current} = this.state
    let option

    if(current == 'home'){
      option = {
        page:0,
        areaNumber:7
      }
    }else if(current == 'top_cra'){
      option = {
        page:1,
        areaNumber:1
      }
    }else{
      option = {
        page:2,
        areaNumber:1
      }
    }
    this.setState({modalLoad:true,load:true})
    dispatch(delRecommend(this.state.rec_info.id)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({modalLoad:false,rec_info:null,position:null,portraitList:[],modal:false,load:false,portrait:null})
      }else{
        this.setState({modalLoad:false,rec_info:null,position:null,portraitList:[],modal:false,portrait:null})
        dispatch(fetchRecommed(option)).then((e)=>{
          if(e.error){
            message.error(e.error.message);
            this.setState({load:false})
          }else{
            this.setState({load:false})
          }
        })
      }
    });
  }

  takePic=(x)=>{
    if(x.picture){
      return x.picture
    }else if(x.product){
      return x.product.product_slide_pics[0].picture
    }else{
      return x.craftsman.portrait
    }
  }
  render(){
    const {intl:{formatMessage},recommend,location:{pathname}} = this.props;
    const {current,modal,radio,radio_url,radio_pro,portraitList,previewVisible,previewImage,radio_cra} = this.state

    console.log('recommend',recommend)

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      marginBottom:'10px'
    };
    const renderRec = (rec) => {
      let _rec = rec.toJS();
      return Object.entries(_rec).map(v=>{
        return <div style={{marginTop:'20px'}} >
          <h3>{configDirectoryObject(v[0],rec_position)}</h3>
          <br/>
          <Row>
            {v[1].map(x=>(
                <Col span={v[0]=='a1'||v[0]=='a2'?6:3}>
                  <img  onClick={this.openModal.bind(this,x)} style={x.picture?{width:'200px',height:'100px',cursor: 'pointer'}:{width:'100px',height:'100px',cursor: 'pointer'}} src={this.takePic(x)} />
                </Col>
            ))}
          </Row>
          <Button onClick={this.openModal.bind(this,v[0],'new')} style={{marginTop:'15px'}} type="primary" size="small">Add</Button>
        </div>
      })
    }
    return (
      <Row style={{paddingBottom:'100px'}}>
        <Title title={formatMessage({id:`${_tit.recommend_position}`})} />
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="top_cra">Top craftsman</Menu.Item>
          <Menu.Item key="beauty">Beauty</Menu.Item>
        </Menu>
        <Spin  spinning={this.state.load} tip="loading..." >
          <Row>
            {recommend&&renderRec(recommend)}
          </Row>
        </Spin>
        <Modal
          visible={modal}
          onCancel={()=>this.setState({modalLoad:false,rec_info:null,position:null,portraitList:[],modal:false,portrait:null})}
          title={formatMessage({id:'setting'})}
          onOk={this.handleModal}
          maskClosable={false}
          width={550}
          okText="Save"
          cancelText="Cancel"
        >

          <Spin  spinning={this.state.modalLoad} tip="Processing..." >
            <Row style={{paddingLeft:'50px'}}>
              <Row >
                {this.state.hideId&&<Upload
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
                </Upload>}
              </Row>
              <Row style={{marginTop:'30px',marginBottom:20}}>
                {this.state.proId&&<RadioGroup onChange={this.onRadioChange} value={this.state.radio}>
                  {this.state.hideId&&<Radio style={{...radioStyle}} value={1}>Url : <Input disabled={radio==2} style={{width:'300px',marginLeft:'20px'}} value={radio_url} onChange={(e)=>{this.setState({radio_url:e.target.value})}}  /></Radio>}
                  <Radio style={radioStyle} value={2}>Production Id : <Input  disabled={radio==1} style={{width:'300px',marginLeft:'20px'}} value={radio_pro}  onChange={(e)=>{this.setState({radio_pro:e.target.value})}}  /></Radio>
                </RadioGroup>}
                {this.state.craId&&<Row>
                    <span>Craftsman Id :</span>
                    <Input style={{width:'300px',marginLeft:'20px'}} value={radio_cra}  onChange={(e)=>{this.setState({radio_cra:e.target.value})}}  />
                  </Row>}
              </Row>
              {this.state.delBtn&&<Button onClick={this.del} style={{marginTop:'15px'}} type="danger" >{formatMessage({id:'del_rec'})}</Button>}
            </Row>
          </Spin>
        </Modal>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Row>
    )
  }

}


RecommendPosition.propTypes = {
  pathJump : React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  recommend : state.getIn(['recommendPosition','recommend']),
});

export default injectIntl(connect(mapStateToProps)(RecommendPosition))
//const WrappedSystemUser = Form.create()();


