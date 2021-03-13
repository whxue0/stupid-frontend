/*
用户个人中心路由组件
 */

import React from 'react'
import {Result, List, WhiteSpace, Button, Modal,InputItem,ImagePicker,Radio} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {nanoid} from 'nanoid'
import {resetUser,updateUser} from '../../redux/actions'
import './Personal.css'

import {dealImage} from '../../utils/index'

const Item = List.Item

class Personal extends React.Component {

  state = {
      files: [],
      isEdit: false,  //切换信息编辑状态
      fileURL: '',    //上传的头像图片压缩后的base64url
      fileName: '',
      newNickname: '',
      newFaith: '',
      newIntro: '',
      newTag: [],
      newSex:null,
      avatar: ''
  }

  //注销用户
  logout = () => {
    Modal.alert('退出', '确定退出登陆吗?', [
      {text: '取消'},
      {
        text: '确定',
        onPress: ()=> {
          Cookies.remove('userid')
          this.props.resetUser()
        }
      }
    ])
  }

  //切换到信息编辑状态
  editInfo = () => {
      const {nickname, faith, tag, intro, sex, avatar} = this.props.user
      this.setState({
          newNickname: nickname,
          newFaith: faith,
          newIntro: intro,
          newTag: tag,
          newSex: sex,
          avatar: avatar
      })
      this.setState({isEdit: true})
  }

  //取消编辑
  cancelEdit = () => {
      this.setState({isEdit: false})
  }

  //确认修改用户信息
  confirmUpdate = () => {
      Modal.alert('修改信息', '确定修改个人信息吗?', [
          {text: '取消'},
          {
              text: '确定',
              onPress: () => {
                  //将files设为空
                  this.setState({files: []}, () => {
                    this.props.updateUser(this.state)
                  })
                  this.setState({isEdit: false})
              }
          }
      ])
  }

  //上传头像时获取 图片文件的base64URL 和 文件名
  onAvatarChange = (files, type, index) => {
      if(files.length === 0) {
        this.setState({
          files,
          fileURL: '',
          fileName: ''
        });
      } else {
        dealImage(files[0].url, 150, (newBase64) => {
          this.setState({
            files,
            fileURL: newBase64,
            fileName: files[0].file.name
          });
        })
      }
  }
  //字符串表单变化时触发
  handleChange = (name, val) => {
      this.setState({
          [name]:val
      })
  }
  //标签表单变化时触发
  handleTagChange = (val) => {
      this.setState({
        newTag: val.trim().split(/\s+/)
      })
  }

  handleNewSex = (num) => {
    this.setState({newSex: num})
  }

  render() {
    const {username, nickname, avatar, faith, tag, intro, sex, redirectTo} = this.props.user
    const {files, isEdit,newSex, newFaith, newIntro, newTag, newNickname} = this.state;
    // 读取cookie中的userid
    const userid = Cookies.get('userid')
    // 如果没有, 自动重定向到登陆界面
    if(!userid) {
      return <Redirect to='/login'/>
    }
    if(redirectTo === '/login') {
      return <Redirect to = {redirectTo}/>
    }
    return (
        <div>
            {isEdit ? 
                (
                    <div className="container" style={{marginBottom:50, marginTop:50}}>
                        <ImagePicker
                            className="user-avatar"
                            files={files}
                            length = {1}
                            onChange={this.onAvatarChange}
                            selectable={files.length < 1}
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                        />
                        <p>点击上传新头像</p>
                        <List>
                          <InputItem defaultValue={newNickname}
                            onChange={(val) => this.handleChange('newNickname', val)}
                          >昵 称：</InputItem>

                          <Item>
                            性 别：&nbsp;&nbsp;&nbsp;
                            保密&nbsp;
                            <Radio 
                              checked={newSex === 0}
                              className="my-radio"
                              onClick={() => this.handleNewSex(0)}
                            ></Radio>
                            &nbsp;&nbsp;
                            男&nbsp;
                            <Radio 
                              checked={newSex === 1}
                              className="my-radio"
                              onClick={() => this.handleNewSex(1)}
                            ></Radio>
                            &nbsp;&nbsp;
                            女&nbsp;
                            <Radio 
                              checked={newSex === 2}
                              className="my-radio"
                              onClick={() => this.handleNewSex(2)}
                            ></Radio>
                          </Item>

                          <InputItem style={{fontSize: 'smaller'}} 
                            defaultValue={newFaith}
                            onChange={(val) => this.handleChange('newFaith', val)}
                          >信 仰：</InputItem>
                          
                          <InputItem style={{fontSize: 'smaller'}} 
                            defaultValue={newIntro}
                            onChange={(val) => this.handleChange('newIntro', val)}
                          >介 绍：</InputItem>
                        
                          <InputItem 
                            style={{fontSize: 'smaller'}}
                            defaultValue={newTag.toString().replace(/,/g, ' ')}
                            onChange = {(val) => this.handleTagChange(val)}
                          >标 签：</InputItem>
                        </List>

                        <Button type='primary' onClick={this.confirmUpdate}>确定修改</Button>
                        <Button type='warning' onClick={this.cancelEdit}>取消修改</Button>
                    </div>
                )
                : 
                (
                    <div style={{marginBottom:50, marginTop:50}}>
                        <Result
                        img={<img src={avatar} style={{width: 60 , maxHeight: 65}} alt="header"/>}
                        title={nickname}
                        message={'账号：' + username}
                        />
                        <List renderHeader={() => '个人信息'}>
                        <Item multipleLine>
                            <Item>性别：{sex === 0 ? '未知' : sex===1 ? '男' : '女'}</Item>
                            <Item wrap>信仰：{faith}</Item>
                            <WhiteSpace/>
                            <Item wrap>介绍: {intro}</Item>
                            <WhiteSpace/>
                            <Item wrap>标签: {tag.map( (item) => (<span key={nanoid()} className="user-tag"> #{item}# </span>))}</Item>
                        </Item>
                        </List>
                        <WhiteSpace/>
                        <List>
                            <WhiteSpace/>
                            <Button type='primary' onClick={this.editInfo}>修改信息</Button>
                            <WhiteSpace/>
                            <Button type='warning' onClick={this.logout}>退出登录</Button>
                            <WhiteSpace/>
                        </List>
                    </div>
                ) 
            }
        </div>

        
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {resetUser,updateUser}
)(Personal)