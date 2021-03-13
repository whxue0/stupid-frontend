//logo组件
import React from 'react'
import logo from './logo192.png'
import './Logo.css'

export default function Logo() {
    return (
        <div className="logo-container">
            <img src={logo} alt="logo" className='logo-img'/>
        </div>
    )
}
