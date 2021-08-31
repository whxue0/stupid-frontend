import axios from 'axios'

//后端请求前缀，所有带有该前缀的请求都会经过nginx反向代理转发到后端接口
//const baseUrl = '/api'  
//本地测试使用下方常量
const baseUrl = 'http://localhost:3000/api'

//封装异步请求，遇到get请求将会把data对象以键值对的形式拼接到请求的url中
export default function ajax(url = '', data = {}, type = 'GET') {
    url = baseUrl + url
    if(type === 'GET') {
        let dataStr = ''
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&'
        })
        if(dataStr !== '') {
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
            url = url + '?' + dataStr
        }
        return axios.get(url)
    } else {
        return axios.post(url, data)
    }
}