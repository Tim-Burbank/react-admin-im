import React from 'react'
import {Table} from 'antd'
import Immutable from 'immutable'
import QueueAnim from 'rc-queue-anim';
import { TweenOneGroup } from 'rc-tween-one';
import {immutableValueRender,autoMergeCells,columnMapFuns} from '../../utils/columns'

export const SmallTable=props=><Table rowKey={(r,i)=>i} bordered={true} size="small" pagination={false} {...props} />

//添加选择项，click row 自动选择
export class SmallSelectionTable extends React.PureComponent {
  constructor(props){
    super(props)
    this.state={
      selectedRowKeys:[]
    }
  }
  onChange=()=>{
    const {dataSource,rowSelection}=this.props;
    if(dataSource && rowSelection && rowSelection.onChange){
      rowSelection.onChange(this.state.selectedRowKeys,this.state.selectedRowKeys.map(index=>dataSource[index]));
    }
  }
  render(){
    const props={

      //单击行自动选择
      onRowClick:(record,index)=>{
        console.log('onRowClick',index);
        if(this.state.selectedRowKeys.indexOf(index)<0){
          if(this.props.rowSelection && this.props.rowSelection.type==='radio'){
            this.setState({selectedRowKeys:[index]},this.onChange)
          }else{
            this.setState({selectedRowKeys:this.state.selectedRowKeys.concat(index)},this.onChange)
          }
        }
      },
      ...this.props,
      rowSelection:{
        ...this.props.rowSelection,
        selectedRowKeys:this.state.selectedRowKeys,

        //单选框改变时自动设置 selectedRowKeys,并回调props onChange
        onChange:(keys,rows)=>{
          this.setState({selectedRowKeys:keys},this.onChange)
        }
      }
    }
    console.log('selectedRowKeys',this.state.selectedRowKeys)
    return <SmallTable {...props} />
  }
}



/**
 * 参数说明
 * dataSource    表格数据              类型：Immutable.List()
 * mergeCells    是否自动合并单元格      类型：boolean   //需要在columns中设置表单 mergeCells为 true
 *
 * **/
export class ImmutableTable extends React.PureComponent{
  static defaultProps={
    dataSource:Immutable.List(),
    className: 'table-enter-leave-demo',
  }

  constructor(props) {
    super(props)
    this.enterAnim = [
      { opacity: 0, x: 30, backgroundColor: '#fffeee', duration: 0 },
      {
        height: 0,
        duration: 200,
        type: 'from',
        delay: 250,
        ease: 'easeOutQuad',
        onComplete: this.onEnd,
      },
      { opacity: 1, x: 0, duration: 250, ease: 'easeOutQuad' },
      { delay: 1000, backgroundColor: '#fff' },
    ];
    this.leaveAnim = [
      { duration: 250, opacity: 0 },
      { height: 0, duration: 200, ease: 'easeOutQuad' },
    ];
    this.currentPage = 1;
    this.newPage = 1;
  }

  getBodyWrapper = (body) => {
    if (this.currentPage !== this.newPage) {
      this.currentPage = this.newPage;
      return body;
    }
    return (<TweenOneGroup
      component="tbody"
      className={body.props.className}
      enter={this.enterAnim}
      leave={this.leaveAnim}
      appear={false}
    >
      {body.props.children}
    </TweenOneGroup>);
  }

  render(){
    // console.log('渲染Immutable Table',this.props.dataSource)
    const columns=this.props.columns.map(
      this.props.mergeCells?
      columnMapFuns(immutableValueRender,autoMergeCells(this.props.dataSource)):
      immutableValueRender
    );
    return <SmallTable getBodyWrapper={this.getBodyWrapper} {...this.props} columns={columns} dataSource={this.props.dataSource.toArray()} />
  }
}
