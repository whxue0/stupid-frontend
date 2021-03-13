/*
主界面的路由组件
 */

import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie' 
import {NavBar} from 'antd-mobile'

import User from '../User/User'
import Post from '../Post/Post'
import EditPost from '../EditPost/EditPost'
import Message from '../Message/Message'
import Personal from '../Personal/Personal'
import NotFound from '../../components/NotFound/NotFound'
import NavFooter from '../../components/NavFooter/NavFooter'
import Chat from '../Chat/Chat'

import {getUser} from '../../redux/actions'

class Main extends Component {

  // 导航组件数据
  navList = [ 
    {
      path: '/post',  // 路由路径
      component: Post,  // 路由组件
      title: '傻瓜病情交流中心', 
      icon: 'home',
      text: '交流',
    },
    {
      path: '/user', 
      component: User,
      title: '傻瓜堆',
      icon: 'team',
      text: '用户',
    },
    {
      path: '/message', 
      component: Message,
      title: '瓜友私聊',
      icon: 'friend',
      text: '私聊',
    },
    {
      path: '/personal', 
      component: Personal,
      title: '傻瓜本瓜',
      icon: 'mine',
      text: '我的',
    }
  ]

  componentDidMount () {
      const userid = Cookies.get('userid')
      const {_id} = this.props.user
      if(userid && !_id) {
          // 发送异步请求, 获取user
          this.props.getUser() 
      }
  }

  render() {
    const userid = Cookies.get('userid')
    // 没有userid自动重定向到登陆界面
    if(!userid) {
      return <Redirect to='/login'/>
    }
    // 如果有,读取redux中的user状态
    const {user, unReadCount} = this.props
    // 如果user有没有_id, 返回null(不做任何显示)
    if(!user._id) {
      return null
    } else {
      // 如果有_id, 显示对应的界面
      let path = this.props.location.pathname
      if(path==='/') {
        path = '/post'
        return <Redirect to= {path}/>
      }
    }

    const {navList} = this
    const path = this.props.location.pathname // 请求的路径
    const currentNav = navList.find(nav=> nav.path===path) // 得到当前的nav, 没有则跳转到NotFound组件
    return (
      <div>
        {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
        {/* 根据路由进行路由组件的渲染 */}
        <Switch>
          {
            navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component}/>)
          }
          <Route path='/editPost' component={EditPost}/>
          <Route path='/chat/:userid' component={Chat}/>
          <Route component={NotFound}/>
        </Switch>
        {/* 下方导航 */}
        {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, unReadCount: state.chat.unReadCount}),
  {getUser}
)(Main)