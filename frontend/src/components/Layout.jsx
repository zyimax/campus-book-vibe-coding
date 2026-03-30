import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout as AntLayout, Avatar, Dropdown, Button, Drawer } from 'antd'
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  LogoutOutlined,
  BookOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  MenuOutlined,
  HeartOutlined,
  MessageOutlined
} from '@ant-design/icons'
import ColorSchemeSwitcher from './ColorSchemeSwitcher'

const { Header, Content, Footer } = AntLayout

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/publish', icon: <PlusCircleOutlined />, label: '发布书籍' },
  { key: '/orders', icon: <ShoppingOutlined />, label: '我的订单' },
  { key: '/profile', icon: <UserOutlined />, label: '个人中心' }
]

const buttonStyles = {
  width: '44px',
  height: '44px',
  borderRadius: 'var(--radius-full)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all var(--transition-normal)',
  background: 'var(--bg-tertiary)',
  color: 'var(--text-primary)'
}

const navButtonStyles = (isActive) => ({
  height: '44px',
  padding: '0 var(--spacing-5)',
  borderRadius: 'var(--radius-full)',
  fontWeight: 'var(--font-medium)',
  fontSize: 'var(--text-base)',
  background: isActive ? 'var(--primary-gradient)' : 'transparent',
  border: 'none',
  boxShadow: isActive ? 'var(--shadow-md)' : 'none',
  color: isActive ? 'white' : 'var(--text-primary)',
  transition: 'all var(--transition-normal)',
  position: 'relative',
  overflow: 'hidden',
  minWidth: '100px',
  textAlign: 'center'
})

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }, [])

  const userMenuItems = useMemo(() => [
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
  ], [navigate, handleLogout])

  const renderNavButtons = useMemo(() => {
    return menuItems.map(item => {
      const isActive = location.pathname === item.key
      return (
        <Link key={item.key} to={item.key} style={{ textDecoration: 'none' }}>
          <Button
            type={isActive ? 'primary' : 'text'}
            icon={item.icon}
            style={navButtonStyles(isActive)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = isActive ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = isActive ? 'var(--shadow-md)' : 'none'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.6s ease'
              }} />
            )}
          </Button>
        </Link>
      )
    })
  }, [location.pathname])

  const renderUserButton = (icon, onClick) => (
    <Button
      type="text"
      icon={icon}
      style={buttonStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-quaternary)'
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-tertiary)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    />
  )

  const renderFooterLink = (path, text) => (
    <Link to={path} style={{
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      transition: 'all var(--transition-normal)',
      fontSize: 'var(--text-sm)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--primary-color)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'var(--text-secondary)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
      {text}
    </Link>
  )

  return (
    <AntLayout style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <ColorSchemeSwitcher />
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 var(--spacing-6)',
          height: '72px',
          background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          transition: 'all var(--transition-normal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: scrolled ? '1px solid var(--border-color)' : 'none'
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'all var(--transition-normal)',
            padding: 'var(--spacing-2) 0'
          }}>
            <BookOutlined style={{
              fontSize: '32px',
              color: 'var(--primary-color)',
              transition: 'all var(--transition-normal)',
              filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
            }} />
            <span style={{
              position: 'relative',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>校园书市</span>
          </div>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          flex: 1,
          justifyContent: 'center',
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }}>
          {renderNavButtons}
        </div>

        <div style={{
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block'
          }
        }}>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '24px' }} />}
            onClick={() => setMobileMenuOpen(true)}
            style={buttonStyles}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          {renderUserButton(
            <SearchOutlined style={{ fontSize: '20px' }} />,
            () => navigate('/search')
          )}

          {renderUserButton(
            <MessageOutlined style={{ fontSize: '20px' }} />,
            () => {}
          )}

          {renderUserButton(
            <HeartOutlined style={{ fontSize: '20px' }} />,
            () => {}
          )}

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <div style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--radius-full)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}>
              <Avatar
                size={44}
                icon={<UserOutlined />}
                style={{
                  background: 'var(--primary-gradient)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all var(--transition-normal)'
                }}
              />
            </div>
          </Dropdown>
        </div>
      </Header>

      <Drawer
        title="校园书市"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div style={{ padding: 'var(--spacing-4)' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.key
            return (
              <Link key={item.key} to={item.key} style={{ textDecoration: 'none' }}
                onClick={() => setMobileMenuOpen(false)}>
                <Button
                  type={isActive ? 'primary' : 'text'}
                  icon={item.icon}
                  block
                  style={{
                    marginBottom: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-lg)',
                    background: isActive ? 'var(--primary-gradient)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </Drawer>

      <Content style={{
        marginTop: '72px',
        padding: 'var(--spacing-8)',
        minHeight: 'calc(100vh - 72px - 120px)',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
      }}>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </Content>

      <Footer style={{
        textAlign: 'center',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        padding: 'var(--spacing-10) var(--spacing-4)',
        color: 'var(--text-secondary)',
        boxShadow: 'var(--shadow-inset)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-6)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
            width: '100%',
            maxWidth: '600px'
          }}>
            <BookOutlined style={{
              fontSize: '32px',
              color: 'var(--primary-color)',
              marginBottom: 'var(--spacing-2)',
              filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
            }} />
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>校园书市</div>
            <div style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              lineHeight: 'var(--leading-relaxed)',
              textAlign: 'center'
            }}>
              让每一本书找到新主人，让知识在校园流动
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 'var(--spacing-8)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {renderFooterLink('/', '首页')}
            {renderFooterLink('/publish', '发布书籍')}
            {renderFooterLink('/orders', '我的订单')}
            {renderFooterLink('/profile', '个人中心')}
          </div>

          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginTop: 'var(--spacing-4)',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border-light)',
            width: '100%',
            textAlign: 'center'
          }}>
            © 2024 校园二手书交易平台，用心连接每一位读者
          </div>
        </div>
      </Footer>
    </AntLayout>
  )
}

export default Layout
