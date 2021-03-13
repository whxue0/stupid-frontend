/**
 * 动态发布路由组件
**/
import React, { Component } from 'react'
import {Icon, NavBar,ImagePicker, TextareaItem , Button, Modal} from 'antd-mobile'
import {connect} from 'react-redux'
import {createPost} from '../../redux/actions'
import {dealImageList} from '../../utils/index'

class EditPost extends Component {

    state = {
        files:[],
        content:'',
        urlList:[],
        nameList:[]
    }

    // 发布动态确定
    createPost = () => {
        Modal.alert('确认消息', '确定发布动态吗?', [
            {text: '取消'},
            {
                text: '确定',
                onPress: () => {
                    if(this.state.content !== '' || this.state.urlList.length > 0) {
                        let postItem = this.state;
                        postItem.files = null;
                        this.props.createPost(postItem);
                        this.props.history.goBack()
                    }
                }
            }
        ])
    }

    //当有图片上传或者删除
    onPhotoChange = (files, type, index) => {
        //当前长度为0
        if(files.length === 0) {
            this.setState({
                files,
                photoList:[]
            });
        } else {
            //当前长度不为0
            let urlList = [];
            let nameList = [];
            for(let i = 0 ; i<files.length; i++) {
                urlList.push(files[i].url);
                nameList.push(files[i].file.name)
            }
            //异步压缩图片列表url
            dealImageList(urlList, 300, (newList) => {
                this.setState({
                    urlList: newList,
                    nameList,
                    files
                })
            })
        }
    }

    //文本框变化
    textAreaOnChange = (val) => {
        this.setState({content: val})
    }

    render() {
        const { files } = this.state;
        return (
            <div style={{marginTop:50, marginBottom: 50}}>
                <NavBar
                    icon={<Icon type='left'/>}
                    className='sticky-header'
                    onLeftClick={()=> this.props.history.goBack()}
                >
                    请发布您的病情
                </NavBar>

                <TextareaItem
                    placeholder="write something..."
                    rows={5}
                    count={100}
                    onChange={(val) => {this.textAreaOnChange(val)}}
                />

                <ImagePicker
                    files={files}
                    length = {3}
                    onChange={this.onPhotoChange}
                    selectable={files.length < 9}
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                />
                <Button type="primary" onClick={this.createPost}>发布</Button>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    {createPost}
)(EditPost)