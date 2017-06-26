import React from 'react'
import Nav from '../../containers/sider/Nav'
import User from '../../containers/sider/User'
import './CoreLayout.scss'
import { Layout, Icon } from 'antd'
const { Content, Sider } = Layout
//const collapsed = localStorage.getItem('collapsed') === 'true'
class CoreLayout extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline'
  };
  onCollapse = (collapsed) => {
    //let nowState = !this.state.collapsed
    //localStorage.setItem('collapsed', nowState)
    this.setState({
      collapsed,
      mode:collapsed  ? 'vertical' : 'inline'
    });
  };


  render () {
    return (



      <Layout className='layout-main'>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          width='250'
          className="sider-main"
          >
          <div className="logo" >
            <p  className="word">YSELF</p>
          </div>
          {/*<User />*/}
          <Nav mode={this.state.mode} />
        </Sider>
        <Layout>
          <Content className='content'>
            <div className='content-wrap'>
              {this.props.children}
            </div>
          </Content>
        </Layout>
      </Layout>

    )
  }
}



CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
