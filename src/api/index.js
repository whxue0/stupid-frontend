import ajax from './ajax'

// 注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
// 登录接口
export const reqLogin = (user) => ajax('/login', user, 'POST');

// 上传图片测试
//export const uploadTest = (url) => ajax('/upload', url, 'POST');

// 获取用户信息
export const reqGetUser = () => ajax('/getUser');
// 更新个人信息
export const reqUpdateUser = (newUser) => ajax('/updateUser', newUser, 'POST');
// 获取用户列表
export const reqUserList = () => ajax('/userList')

// 获取当前用户的聊天消息列表
export const reqChatMsgList = () => ajax('/msglist')
// 修改指定消息为已读
export const reqReadMsg = (from) => ajax('/readmsg', {from}, 'POST')

// 创建帖子
export const reqCreatePost = (post) => ajax('/createPost', post, 'POST')
// 获取帖子列表
export const reqGetPost = () => ajax('/getPost')


//----------------未实现API-------------

// 删除帖子
export const reqDeletePost = (obj) => ajax('/deletePost', obj, 'POST') 
// 评论帖子
export const reqCommentPost = (obj) => ajax('/commentPost', obj, 'POST')
// 获取用户本人帖子
export const reqGetMinePost = () => ajax('getMinePost')
// 下拉获取更多帖子
export const reqGetLatest = (obj) => ajax('/getLatest', obj, 'POST')
// 下拉获取更多帖子
export const reqGetMore = (obj) => ajax('/getMore', obj, 'POST')
// 获取他人帖子
export const reqGetOtherPost = (username) => ajax('/getOtherPost', {username}, 'GET')