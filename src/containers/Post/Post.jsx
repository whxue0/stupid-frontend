import { nanoid } from 'nanoid'
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getPostList} from '../../redux/actions'
import {formatTime} from '../../utils/index'
import LazyLoad  from 'react-lazyload'
import './Post.css'
class Post extends Component {

    componentDidMount(){
        this.props.getPostList();

    }

    render() {
        const {postList, users} = this.props;
        let userCount = 0;
        for(let i in users) {
            if(users.hasOwnProperty(i)) {
                userCount++;
            }
        }
        return (
            <div className="container" style={{marginBottom:50, marginTop:50}}>
                {
                    postList.length > 0 && userCount > 0 ? 
                    postList.map( (postItem) => 
                        <div className="post-container" key={postItem._id}>
                            <div className="post-header">
                                <img className="post-avatar" src={users[postItem.owner].avatar} alt="用户头像"/>
                                <span className="post-nickname">{users[postItem.owner].nickname}</span>
                                <span className="post-time">{formatTime(new Date(postItem.create_time))}</span>
                            </div>
                            
                            <div className="post-body">
                            
                                <div className="post-content"><hr/>{postItem.content}</div>
                                <div className="photo-box">
                                    {
                                        postItem.photo.length > 0 ?
                                        postItem.photo.map(
                                            (photo) => 
                                            <LazyLoad key={nanoid()} height={100} offset={0}>
                                                <img src={photo} className="photo-item" alt="图片加载中"/>
                                            </LazyLoad>
                                        )
                                        :
                                        null
                                    }
                                </div>

                            </div>
                            
                        </div>
                    ) 
                    :
                    <div>暂无无动态</div>
                
                }
                <img onClick={() => this.props.history.push(`/editPost`)} className="add-post" src={require(`./images/add.png`).default} alt=""/>
            </div>
        )
    }
}
export default connect(
    state => ({postList: state.postList,users: state.chat.users}),
    {getPostList}
)(Post)