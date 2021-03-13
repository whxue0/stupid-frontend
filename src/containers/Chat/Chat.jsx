/*
对话聊天的路由组件
 */

import React, {Component} from 'react'
import {NavBar, InputItem, Icon, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg, readMsg} from '../../redux/actions'
import './Chat.css'

class Chat extends Component {

    state = {
      content: '',
    }

    componentDidMount() {
      // 初始显示列表
      window.scrollTo(0, document.body.scrollHeight)
    }

    componentDidUpdate () {
        // 更新显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }

    // 在退出之前将当前消息设为已读
    componentWillUnmount () {
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }

    //点击发送按钮触发
    handleSend = () => {
        // 收集数据
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        // 发消息
        if(content) {
          this.props.sendMsg({from, to, content})
        }
        // 清除输入数据
        this.setState({
          content: '',
        })
    }

    //输入框变化
    contentOnChange = (val) => {
      this.setState({content: val})
    }

    render() {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat

        // 计算当前聊天的chatId
        const meId = user._id
        // 如果还没有获取数据, 直接不做任何显示
        if(!users[meId]) { 
          return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join('_')

        // 对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id===chatId)

        // 获取用户头像地址
        const targetAvatar = users[targetId].avatar;

        return (
            <div>
                <NavBar
                  icon={<Icon type='left'/>}
                  className='sticky-header'
                  onLeftClick={()=> this.props.history.goBack()}
                >
                    {users[targetId].nickname}
                </NavBar>
                <div style={{marginTop:50, marginBottom: 50}}>
                    {
                        msgs.map(msg => {
                          // 收到的信息，放左边
                            if(targetId===msg.from) {
                                return (
                                    <div className='talk-box' key={msg._id} >
                                        <img src={targetAvatar} alt=""/>
                                        <span className="arrow-left"></span>
                                        <span className="bubble-left">{msg.content}</span>
                                    </div>
                                )
                          // 接收的信息，放右边
                            } else { 
                                return (
                                    <div className='talk-box' key={msg._id} >
                                        <img src={user.avatar} className="right-avatar-img" alt=""/>
                                        <span className="arrow-right"></span>
                                        <span className="bubble-right">{msg.content}</span>
                                    </div>
                                )
                            }
                        })
                    }
                </div>

                {/* 消息输入框 + 发送按钮 */}
                <div className='am-tab-bar'>
                    <InputItem
                      placeholder="请输入"
                      value={this.state.content}
                      onChange={(val) => this.contentOnChange(val)}
                      extra={
                          <Button inline size='small' onClick={this.handleSend}>发送</Button>
                      }
                    />
                </div>
            </div>
        )
    }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg, readMsg}
)(Chat)