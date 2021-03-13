/*
  登录路由组件
*/

import React, { Component } from 'react'

import {
    NavBar, 
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button,
} from 'antd-mobile'

import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/Logo/Logo'
import {login} from '../../redux/actions'

class Login extends Component {

    state = {
        username: '',
        password: '',
        firstMount: true
    }

    handleChange = (name, value) => {
        this.setState({[name] : value})
    }

    toRegister = () => {
        this.props.history.replace('/register')
    }

    login = () => {
        this.setState({firstMount: false})
        this.props.login(this.state)
    }

    render() {
        const {firstMount} = this.state
        const {redirectTo, msg} = this.props

        //登录成功跳转
        if(redirectTo === '/') {
            return <Redirect to={redirectTo}/>
        }
        
        return (
            <div>
                <NavBar>傻瓜地球人</NavBar>
                <Logo/>
                <WingBlank>
                    {!firstMount && msg ? <p className='error-msg'>{msg}</p> : null}
                    <List>
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
                        <WhiteSpace/>
                        <Button  type="primary" onClick={this.login}>登 录</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toRegister}>还没有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    {login}
)(Login)