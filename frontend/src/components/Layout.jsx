import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Button } from 'antd'
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  LogoutOutlined,
  BookOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons'

const { Header, Content, Footer } = AntLayout

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/publish', icon: <PlusCircleOutlined />, label: '发布书籍' },
  { key: '/orders', icon: <ShoppingOutlined />, label: '我的订单' },
  { key: '/profile', icon: <UserOutlined />, label: '个人中心' }
]

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const userMenuItems = [
    { 
      key: 'profile', 
      icon: <UserOutlined />, 
      label: '个人中心',
      onClick: () => navigate('/profile')
    },
    { 
      key: 'logout', 
      icon: <LogoutOutlined />, 
      label: '退出登录',
      onClick: handleLogout
    }
  ]

  return (
    <AntLayout style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* 顶部导航栏 */}
      <Header 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 24px',
          height: '64px',
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: scrolled ? '1px solid var(--border-color)' : 'none'
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            fontSize: '22px', 
            fontWeight: 700,
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            <BookOutlined style={{ fontSize: '28px', color: 'var(--primary-color)' }} />
            <span>校园书市</span>
          </div>
        </Link>

        {/* 桌面端导航菜单 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          flex: 1,
          justifyContent: 'center'
        }}>
          {menuItems.map(item => (
            <Link 
              key={item.key} 
              to={item.key}
              style={{ textDecoration: 'none' }}
            >
              <Button
                type={location.pathname === item.key ? 'primary' : 'text'}
                icon={item.icon}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  fontSize: '15px',
                  background: location.pathname === item.key ? 'var(--primary-gradient)' : 'transparent',
                  border: 'none',
                  boxShadow: location.pathname === item.key ? 'var(--shadow-md)' : 'none'
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* 右侧用户区域 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* 搜索按钮 */}
          <Button
            type="text"
            icon={<SearchOutlined style={{ fontSize: '18px' }} />}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => navigate('/search')}
          />

          {/* 用户头像下拉菜单 */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar 
                size={40}
                icon={<UserOutlined />} 
                style={{ 
                  background: 'var(--primary-gradient)',
                  boxShadow: 'var(--shadow-md)'
                }} 
              />
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* 主内容区域 */}
      <Content style={{ 
        marginTop: '64px',
        padding: '24px',
        minHeight: 'calc(100vh - 64px - 70px)',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
      }}>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </Content>

      {/* 页脚 */}
      <Footer style={{ 
        textAlign: 'center',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        padding: '24px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <BookOutlined style={{ fontSize: '24px', color: 'var(--primary-color)', marginBottom: '8px' }} />
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>校园书市</div>
        </div>
        <div style={{ fontSize: '14px' }}>
          让每一本书找到新主人 · 让知识在校园流动
        </div>
        <div style={{ fontSize: '12px', marginTop: '12px', color: 'var(--text-muted)' }}>
          © 2024 校园二手书交易平台 · 用心连接每一位读者
        </div>
      </Footer>
    </AntLayout>
  )
}

export default Layout
