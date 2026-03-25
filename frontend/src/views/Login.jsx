import React, { useState, useCallback } from 'react'
import { Form, Input, Button, Card, message, Divider, Alert } from 'antd'
import { UserOutlined, LockOutlined, BookOutlined, ArrowRightOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { userAPI } from '../api'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onFinish = useCallback(async (values) => {
    setLoading(true)
    setError(null)
    try {
      const res = await userAPI.login(values)
      const token = res.data?.token || res.data
      localStorage.setItem('token', token)
      message.success('登录成功')
      navigate('/')
    } catch (error) {
      console.error('登录失败', error)
      const errorMsg = error.response?.data?.message || error.message || '登录失败，请检查用户名和密码'
      setError(errorMsg)
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword)
  }, [showPassword])

  const renderInput = (prefix, placeholder, rules) => (
    <Input
      prefix={prefix}
      placeholder={placeholder}
      size="large"
      style={{
        borderRadius: 'var(--radius-lg)',
        height: '52px',
        fontSize: '16px',
        border: '1px solid var(--border-light)',
        transition: 'all var(--transition-normal)'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#667eea'
        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--border-light)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 'var(--radius-xl)',
      margin: '0 -24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <Card style={{
        width: 420,
        maxWidth: '100%',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: 'none',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.6s ease forwards'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px 40px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          margin: '-24px -24px 32px',
          position: 'relative'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            animation: 'scaleIn 0.5s ease forwards'
          }}>
            <BookOutlined style={{ fontSize: '36px', color: '#667eea' }} />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '8px',
            animation: 'fadeIn 0.5s ease 0.2s forwards',
            opacity: 0
          }}>
            欢迎回来
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.9)',
            animation: 'fadeIn 0.5s ease 0.4s forwards',
            opacity: 0
          }}>
            登录校园书市，开启您的阅读之旅
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          style={{ padding: '0 32px 32px' }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: '20px' }}
              animationDuration={0.3}
            />
          )}

          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            {renderInput(<UserOutlined style={{ color: 'var(--text-muted)' }} />, '用户名/邮箱/手机号')}
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="密码"
              size="large"
              style={{
                borderRadius: 'var(--radius-lg)',
                height: '52px',
                fontSize: '16px',
                border: '1px solid var(--border-light)',
                transition: 'all var(--transition-normal)'
              }}
              iconRender={(visible) => (
                visible ? (
                  <EyeOutlined onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                ) : (
                  <EyeInvisibleOutlined onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                )
              )}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea'
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-light)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: '52px',
                borderRadius: 'var(--radius-lg)',
                fontSize: '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                登录 <ArrowRightOutlined style={{ marginLeft: '8px' }} />
              </span>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.6s ease'
              }} />
            </Button>
          </Form.Item>

          <Divider style={{ margin: '24px 0' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>还没有账号？</span>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">
              <Button
                type="default"
                block
                size="large"
                style={{
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '16px',
                  fontWeight: 500,
                  border: '2px solid #667eea',
                  color: '#667eea',
                  background: 'white',
                  transition: 'all var(--transition-normal)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9ff'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                立即注册
              </Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
