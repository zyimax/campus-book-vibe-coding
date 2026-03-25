import React, { useEffect, useState, useCallback } from 'react'
import { Card, Form, Input, Button, Avatar, Upload, message, List, Spin, Empty } from 'antd'
import { UserOutlined, UploadOutlined, EnvironmentOutlined, ShoppingOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
import { userAPI } from '../api'
import { useNavigate } from 'react-router-dom'

const menuItems = [
  {
    icon: <ShoppingOutlined />,
    title: '我的订单',
    description: '查看订单状态和交易记录',
    path: '/orders'
  },
  {
    icon: <EnvironmentOutlined />,
    title: '收货地址',
    description: '管理收货地址信息',
    path: '/address'
  }
]

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await userAPI.getProfile()
      setUser(res.data)
      form.setFieldsValue(res.data)
    } catch (error) {
      console.error('获取用户信息失败', error)
      setError('获取用户信息失败，请稍后重试')
      message.error('获取用户信息失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [form])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleUpdate = useCallback(async (values) => {
    setLoading(true)
    try {
      await userAPI.updateProfile(values)
      message.success('更新成功')
      fetchProfile()
    } catch (error) {
      console.error('更新失败', error)
      message.error('更新失败，请检查网络连接或稍后重试')
    } finally {
      setLoading(false)
    }
  }, [fetchProfile])

  const handleAvatarUpload = useCallback(async (info) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true)
    } else if (info.file.status === 'done') {
      const avatarUrl = info.file.response?.data?.url
      if (avatarUrl) {
        try {
          await userAPI.updateProfile({ avatar: avatarUrl })
          message.success('头像上传成功')
          fetchProfile()
        } catch (error) {
          console.error('更新头像失败', error)
          message.error('头像上传失败，请稍后重试')
        } finally {
          setAvatarLoading(false)
        }
      } else {
        message.error('头像上传失败')
        setAvatarLoading(false)
      }
    } else if (info.file.status === 'error') {
      message.error('头像上传失败')
      setAvatarLoading(false)
    }
  }, [fetchProfile])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    navigate('/login')
    message.success('已退出登录')
  }, [navigate])

  const uploadProps = {
    name: 'file',
    action: '/api/upload/image',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    showUploadList: false,
    onChange: handleAvatarUpload
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <Spin size="large" style={{ color: 'var(--primary-color)' }} />
        <div style={{ 
          marginLeft: 'var(--spacing-4)', 
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-lg)'
        }}>正在加载个人信息...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 'var(--spacing-20)',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <Empty 
          description={
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              {error}
            </div>
          } 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button 
          type="primary" 
          onClick={fetchProfile}
          style={{ marginTop: 'var(--spacing-4)' }}
        >
          重新加载
        </Button>
      </div>
    )
  }

  const renderMenuItem = (item) => (
    <List.Item
      key={item.path}
      style={{
        cursor: 'pointer',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)',
        transition: 'all var(--transition-normal)',
        marginBottom: 'var(--spacing-3)'
      }}
      onClick={() => navigate(item.path)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-tertiary)'
        e.currentTarget.style.transform = 'translateX(8px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      <List.Item.Meta
        avatar={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            color: 'var(--primary-color)'
          }}>
            {item.icon}
          </div>
        }
        title={
          <div style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)'
          }}>
            {item.title}
          </div>
        }
        description={
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            {item.description}
          </div>
        }
      />
      <EditOutlined style={{ color: 'var(--text-muted)' }} />
    </List.Item>
  )

  return (
    <div style={{ 
      display: 'flex', 
      gap: 'var(--spacing-6)',
      flexWrap: 'wrap'
    }}>
      <Card 
        title="个人中心" 
        style={{
          flex: 1, 
          minWidth: 400,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--bg-primary)'
        }}
        bodyStyle={{ padding: 'var(--spacing-6)' }}
      >
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--spacing-6)',
          padding: 'var(--spacing-4)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <Avatar
            size={120}
            src={user?.avatar}
            icon={<UserOutlined style={{ fontSize: '48px' }} />}
            style={{
              marginBottom: 'var(--spacing-4)',
              border: '4px solid var(--bg-primary)',
              boxShadow: 'var(--shadow-lg)'
            }}
          />
          <Upload {...uploadProps}>
            <Button 
              icon={<UploadOutlined />}
              loading={avatarLoading}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: 'var(--spacing-2) var(--spacing-6)',
                transition: 'all var(--transition-normal)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              更换头像
            </Button>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          style={{ maxWidth: '100%' }}
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input 
              disabled 
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-tertiary)'
              }}
            />
          </Form.Item>
          
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input 
              placeholder="请输入昵称" 
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                transition: 'all var(--transition-normal)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-color)'
                e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-light)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </Form.Item>
          
          <Form.Item
            label="邮箱"
            name="email"
          >
            <Input 
              disabled 
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-tertiary)'
              }}
            />
          </Form.Item>
          
          <Form.Item
            label="手机号"
            name="phone"
          >
            <Input 
              disabled 
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-tertiary)'
              }}
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  flex: 1,
                  background: 'var(--primary-gradient)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-3) 0',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  transition: 'all var(--transition-normal)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
              >
                保存
              </Button>
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-3) var(--spacing-6)',
                  fontSize: 'var(--text-base)',
                  transition: 'all var(--transition-normal)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
              >
                退出登录
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>

      <Card 
        title="常用功能" 
        style={{
          width: 320,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--bg-primary)'
        }}
        bodyStyle={{ padding: 'var(--spacing-4)' }}
      >
        <List
          itemLayout="horizontal"
          dataSource={menuItems}
          renderItem={renderMenuItem}
        />
      </Card>
    </div>
  )
}

export default Profile
