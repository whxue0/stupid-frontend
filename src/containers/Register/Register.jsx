import React, { Component } from 'react'
import {
    NavBar, 
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button,
    Modal
} from 'antd-mobile'

import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {register} from '../../redux/actions'

import Logo from '../../components/Logo/Logo'
import './Register.css'

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
}

class Register extends Component {

    state = {
        username: '',
        password: '',
        password2: '',
        nickname: '',
        isRead: false,
        modal: false,
        firstMount: true    
    }

    register = () => {
        this.setState({firstMount: false})
        this.props.register(this.state)
    }

    handleChange = (name, value) => {
        this.setState({[name] : value})
    }

    toLogin = () => {
        this.props.history.replace('/login')
    }


    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }
    

    render() {
        const {isRead, firstMount} = this.state
        const {redirectTo, msg} = this.props
        if(redirectTo === '/') {
            return <Redirect to = {redirectTo}/>
        }
        return (
            <div>
                <NavBar>傻瓜地球人</NavBar>
                <Logo/>
                <WingBlank>
                    {!firstMount && msg ? <p className='error-msg'>{msg}</p>:null}
                    <List>
                        <form>

                        
                        <InputItem
                          placeholder='输入账号'
                          onChange={val => this.handleChange('username',val)}
                        >
                            账 号：
                        </InputItem>
                        <WhiteSpace/>
                        <InputItem
                          type='password'
                          placeholder='输入密码'
                          onChange={val => this.handleChange('password',val)}
                        >
                            密 码：
                        </InputItem>
                        <InputItem
                          type='password'
                          placeholder='输入确认密码'
                          onChange={val => this.handleChange('password2',val)}
                        >
                            确认密码：
                        </InputItem>
                        <InputItem
                          placeholder='请输入称呼'
                          onChange={val => this.handleChange('nickname',val)}
                        >
                            称 呼：
                        </InputItem>

                        <List.Item>
                            我已阅读<span className="service" onClick={this.showModal('modal')}>服务协议</span>&nbsp;
                            <Radio checked={isRead}
                                className="my-radio"
                                onClick={() => this.handleChange('isRead', !isRead)}
                            ></Radio>
                        </List.Item>
                        <Button  type="primary" onClick={this.register}>注 册</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toLogin}>已有账号</Button>

                        </form>
                    </List>
                </WingBlank>
                <Modal
                  visible={this.state.modal}
                  transparent
                  maskClosable={false}
                  onClose={this.onClose('modal')}
                  title="服务协议"
                  footer={[{ text: 'Ok', onPress: () => { this.onClose('modal')(); } }]}
                  wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                  afterClose={() => this.handleChange('isRead', true)}
                >
                    <div style={{ height: 100, overflow: 'scroll' }}>
                        <br />
                        首先，你需要是一个地球人<br />
                        其次，你还要是一个傻瓜<br />
                        <br />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    {register}
)(Register)