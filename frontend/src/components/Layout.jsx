import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Dropdown } from 'antd'
import { HomeOutlined, ShoppingOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = AntLayout

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
  { key: '/orders', icon: <ShoppingOutlined />, label: <Link to="/orders">我的订单</Link> },
  { key: '/profile', icon: <UserOutlined />, label: <Link to="/profile">个人中心</Link> }
]

const userMenuItems = [
  { key: 'profile', icon: <UserOutlined />, label: <Link to="/profile">个人中心</Link> },
  { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }
]

function Layout() {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const onClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout()
    }
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          校园二手书交易平台
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
        />
        <Dropdown menu={{ items: userMenuItems, onClick }} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        校园二手书交易平台 ©2024
      </Footer>
    </AntLayout>
  )
}

export default Layout
