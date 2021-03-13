/*
显示指定用户列表的UI组件
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank, WhiteSpace,Button,Modal, List} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import {nanoid} from 'nanoid'
import './UserList.css'
const Item = List.Item
class UserList extends Component {
  static propTypes = {
    userList: PropTypes.array.isRequired
  }
  state = {
    modal: false,
    currUser: null
  }
  showModal = (key, user) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
      currUser: user
    });
  }
  onClose = key => () => {
      this.setState({
          [key]: false,
      });
  }
  render () {
    const {userList} = this.props
    const {currUser} = this.state
    return (
      <WingBlank style={{marginBottom:50, marginTop:50}}>
          {
            userList.map(user => (
              <div className="userItem" key={user._id}>
                <WhiteSpace/>
                <span className="userItem-header" onClick={this.showModal('modal', user)}>
                  <img src={user.avatar} alt=""/>
                  <span className="userItem-name">{user.nickname}</span>
                </span>
                <Button
                  inline
                  style={{float: 'right'}}
                  onClick={() => this.props.history.push(`/chat/${user._id}`)}
                >私聊</Button>
              </div>
            ))
          }
            {currUser === null ? 
                (
                    <div>
                    </div>
                )
                : 
                (
                    <Modal
                      visible={this.state.modal}
                      transparent
                      maskClosable={false}
                      onClose={this.onClose('modal')}
                      title={currUser.nickname}
                      footer={[{ text: '看完', onPress: () => { this.onClose('modal')(); } }]}
                      wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    >
                        <div style={{ height: 300, overflow: 'scroll' }}>
                              <Item>性别：{currUser.sex === 0 ? '未知' : currUser.sex===1 ? '男' : '女'}</Item>
                              <Item wrap>信仰：{currUser.faith}</Item>
                              <WhiteSpace/>
                              <Item wrap>介绍: {currUser.intro}</Item>
                              <WhiteSpace/>
                              <Item wrap>标签: {currUser.tag.map( (item) => (<span key={nanoid()} className="user-tag"> #{item}# </span>))}</Item>
                        </div>
                    </Modal>
                ) 
            }

      </WingBlank>
    )
  }
}

export default withRouter(UserList)