import io from 'socket.io-client'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    GET_USER,
    EXIT_USER,
    GET_USERLIST,
    RECEIVE_MSGLIST,
    RECEIVE_MSG,
    MSG_READ,

    CREATE_POST,
    GET_POST,
    // COMMENT_POST,
    // DELETE_POST,
    // GET_MINEPOST,
    // GET_MOREPOST,
    // GET_OTHERPOST
} from './action-types'

import {
    reqRegister,
    reqLogin,
    reqGetUser,
    reqUpdateUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg,

    reqCreatePost,
    reqGetPost,
    // reqDeletePost,
    // reqCommentPost,
    // reqGetMinePost,
    // reqGetMore,
    // reqGetOtherPost
} from '../api'

//初始化socket连接
function initIO(dispatch, userid) {
    // if(!io.socket) {
        // 连接服务器, 得到与服务器的连接对象
        //io.socket = io('ws://localhost:5000')
        io.socket = io('ws://www.little-star.cn:5000')
        // 绑定监听, 接收服务器发送的消息
        io.socket.on('receiveMsg', function (chatMsg) {
            // 只要当前用户是信息的发送者或接收者, 才分发同步action保存消息
            if(userid===chatMsg.from || userid===chatMsg.to) {
                dispatch(receiveMsg(chatMsg, userid))
            }
        })
    // }
}

// 异步获取消息列表数据
async function getMsgList(dispatch, userid) {
    //初始化对象
    initIO(dispatch, userid)
    //发送请求
    const response = await reqChatMsgList()
    //解析请求
    const result = response.data
    if(result.code===0) {
        const {users, chatMsgs} = result.data
        // 分发接收消息列表的同步action
        dispatch(receiveMsgList({users, chatMsgs, userid}))
    }
}

// 发送消息的异步action
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        // 发消息
        io.socket.emit('sendMsg', {from, to, content})
    }
}

// 读取消息的异步action
export const readMsg = (from, to) => {
    return async dispatch => {
        //发送请求，接收者已读取发送者发的消息
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code===0) {
            const count = result.data
            //分发消息已读的同步action
            dispatch(msgRead({count, from, to}))
        }
    }
}
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSGLIST, data:{users, chatMsgs, userid}})
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
// 读取了某个聊天消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})


// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})


// 接收用户的同步action
const receiveUser = (user) => ({type: GET_USER, data: user})
// 接收用户列表的同步action
const receiveUserList = (userList) => ({type: GET_USERLIST, data: userList})
// 重置用户的同步action
export const resetUser = (msg) => ({type: EXIT_USER, data: msg})


export function register(user) {
    const {username, password, password2, nickname} = user
    // 做表单的前台检查, 如果不通过, 返回一个errorMsg的同步action
    if(!username) {
        return errorMsg('请输入您的用户名!')
    } else if(password!==password2) {
        return errorMsg('两次输入的密码不一致!')
    } else if(!nickname) {
        return errorMsg('请输入您的昵称！')
    }
    // 表单数据合法, 返回一个发ajax请求的异步action函数
    return async dispatch => {
        const response = await reqRegister({username, password, nickname})
        const result =response.data
        if(result.code === 0) {
            //异步获取聊天信息列表
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

export const login = (user) => {
    const {username, password} = user
    if(!username || !password) {
        return errorMsg('账号或密码不能为空')
    }
    return async dispatch => {
        const response = await reqLogin({username, password})
        const result = response.data
        if(result.code === 0) {
            //异步获取聊天信息列表
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

// 更新用户的异步action
export const updateUser = (newUser) => {
    return async dispatch => {
        const response = await reqUpdateUser(newUser)
        const result = response.data
        if(result.code === 0) {
            //更新成功，分发接收用户的同步action
            dispatch(receiveUser(result.data))
        } else {
            //更新失败，分发重置用户的同步action
            dispatch(resetUser(result.msg))
        }
    }
}

// 获取用户异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqGetUser()
        const result = response.data
        if(result.code===0) { // 成功
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data))
        } else { // 失败
            dispatch(resetUser(result.msg))
        }
    }
}

// 获取用户列表的异步action
export const getUserList = () => {
    return async dispatch => {
        const response = await reqUserList()
        const result = response.data
        if(result.code===0) {
            dispatch(receiveUserList(result.data))
        }
    }
}

//接收帖子列表的同步action
const receivePostList = (postList) => ({type: GET_POST, data: postList})
//获取帖子列表的异步action
export const getPostList = () => {
    return async dispathch => {
        const response = await reqGetPost()
        const result =response.data
        if(result.code === 0) {
            dispathch(receivePostList(result.data))
        } else {
            console.log('获取帖子列表失败')
        }
    }
}

//创建帖子成功的同步action
const receiveCreatePost = (postItem) => ({type: CREATE_POST, data: postItem})
//创建帖子的异步action
export const createPost = (postItem) => {
    const {urlList, nameList, content} = postItem;
    return async dispatch => {
        const response = await reqCreatePost({urlList, nameList, content})
        const result = response.data
        if(result.code === 0) {
            dispatch(receiveCreatePost(result.data))
        } else {
            console.log('更新帖子后获取帖子列表失败')
        }
    }
}