import { combineReducers } from 'redux'

import {
    AUTH_SUCCESS,
    ERROR_MSG,
    GET_USER,
    EXIT_USER,
    UPDATE_USER,
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

const initUser = {
    username: '',
    nickname: '',
    faith: '',
    intro: '',
    avatar: '',
    sex: 0,
    tag: [],
    msg: '',
    redirectTo: ''
}

function user(state = initUser, action) {
    switch(action.type) {
        case AUTH_SUCCESS:
            return {...action.data, redirectTo: '/'}
        case ERROR_MSG:
            return {...state, msg: action.data}
        case GET_USER:
            return action.data
        case EXIT_USER:
            return {...initUser, redirectTo: '/login'}
        case UPDATE_USER:
            return {...action.data, redirectTo: '/personal'}
        default: 
            return state
    }
}

const initUserList = []
//产生userList状态的reducer
function userList(state=initUserList, action) {
    switch (action.type) {
        case GET_USERLIST:
            return action.data
        default:
            return state
    }
}

const initPostList = []
//产生PostList状态的reducer
function postList(state=initPostList, action) {
    switch(action.type) {
        case GET_POST:
          return action.data
        case CREATE_POST:
          return [action.data, ...state]
        default:
          return state
    }
}

const initChat = {
    users : {},  
    chatMsgs: [],
    unReadCount: 0
}
// 产生聊天状态的reducer
function chat(state=initChat, action) {
    switch (action.type) {
        case RECEIVE_MSGLIST:  // data: {users, chatMsgs}
            const {users, chatMsgs, userid} = action.data
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read&&msg.to===userid?1:0),0)
            }
        case RECEIVE_MSG: // data: chatMsg
            const {chatMsg} = action.data
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
            }
        case MSG_READ:
            const {from, to, count} = action.data
            state.chatMsgs.forEach(msg => {
                if(msg.from===from && msg.to===to && !msg.read) {
                    msg.read = true
                }
            })
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from===from && msg.to===to && !msg.read) {
                        return {...msg, read: true}
                    } else {
                        return msg
                    }
                }),
                unReadCount: state.unReadCount-count
            }
        default:
            return state
    }
  }


export default combineReducers({
    user,
    userList,
    chat,
    postList
})