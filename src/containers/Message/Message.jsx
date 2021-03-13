/*
私聊界面路由容器组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie' 

const Item = List.Item
const Brief = Item.Brief

//获取每个聊天分组的最后一条消息，并统计每个分组的未读消息
function getLastMsgs(chatMsgs, userid) {
    // 使用对象容器保存 {chat_id:lastMsg}
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        //对每个发送给该用户的信息，标记是否已读
        if(msg.to===userid && !msg.read) {
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }
        // 获取该信息的分组
        const chatId = msg.chat_id
        let lastMsg = lastMsgObjs[chatId]
        // 当前msg就是所在组的lastMsg
        if(!lastMsg) { 
            lastMsgObjs[chatId] = msg
        } else {
            // 累加unReadCount=已经统计的 + 当前msg的
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
            // 如果msg比lastMsg晚, 就将msg保存为lastMsg
            if(msg.create_time > lastMsg.create_time) {
              lastMsgObjs[chatId] = msg
            }
            // 将unReadCount保存在最新的lastMsg上
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    })

    const lastMsgs = Object.values(lastMsgObjs)

    // 对数组进行排序(按create_time降序)
    lastMsgs.sort(function (m1, m2) {
        return m2.create_time-m1.create_time
    })
    return lastMsgs
}

class Message extends Component {

    render() {
        // 读取cookie中的userid
        const userid = Cookies.get('userid')
        // 如果没有, 自动重定向到登陆界面
        if(!userid) {
            return <Redirect to='/login'/>
        }
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat

        // 对chatMsgs按chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs, user._id)

        return (
            <List style={{marginTop:50, marginBottom: 50}}>
                {
                    lastMsgs.map(msg =>{
                        // 得到目标用户的id
                        const targetUserId = msg.to===user._id ? msg.from : msg.to
                        // 得到目标用户的头像
                        const targetUser = users[targetUserId]
                        return (
                          <div key={msg._id}>
                              <Item
                                extra={<Badge text={msg.unReadCount}/>}
                                arrow='horizontal'
                                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                              >
                                  <img src={targetUser.avatar} style={{width: '50px' , height: '50px'}} alt=""/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                  {targetUser.nickname}
                                  <Brief>{msg.content}</Brief>
                              </Item>
                              <hr/>
                          </div>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {}
)(Message)