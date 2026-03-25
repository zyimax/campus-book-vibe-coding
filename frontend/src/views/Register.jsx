import React, { useState, useCallback } from 'react'
import { Form, Input, Button, Card, message, Alert } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, EyeOutlined, EyeInvisibleOutlined, BookOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { userAPI } from '../api'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onFinish = useCallback(async (values) => {
    setLoading(true)
    setError(null)
    try {
      const { confirmPassword, ...registerData } = values
      await userAPI.register(registerData)
      message.success('注册成功，请登录')
      navigate('/login')
    } catch (error) {
      console.error('注册失败', error)
      const errorMsg = error.response?.data?.message || error.message || '注册失败，请稍后重试'
      setError(errorMsg)
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword)
  }, [showPassword])

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword)
  }, [showConfirmPassword])

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
        e.target.style.borderColor = '#f5576c'
        e.target.style.boxShadow = '0 0 0 3px rgba(245, 87, 108, 0.1)'
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
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
        width: 440,
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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
            <BookOutlined style={{ fontSize: '36px', color: '#f5576c' }} />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '8px',
            animation: 'fadeIn 0.5s ease 0.2s forwards',
            opacity: 0
          }}>
            创建账号
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.9)',
            animation: 'fadeIn 0.5s ease 0.4s forwards',
            opacity: 0
          }}>
            加入校园书市，开启您的阅读之旅
          </p>
        </div>

        <Form
          name="register"
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
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' }
            ]}
          >
            {renderInput(<UserOutlined style={{ color: 'var(--text-muted)' }} />, '用户名')}
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            {renderInput(<MailOutlined style={{ color: 'var(--text-muted)' }} />, '邮箱')}
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            {renderInput(<PhoneOutlined style={{ color: 'var(--text-muted)' }} />, '手机号')}
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为6-20位' }
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
                e.target.style.borderColor = '#f5576c'
                e.target.style.boxShadow = '0 0 0 3px rgba(245, 87, 108, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-light)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="确认密码"
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
                  <EyeOutlined onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }} />
                ) : (
                  <EyeInvisibleOutlined onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }} />
                )
              )}
              onFocus={(e) => {
                e.target.style.borderColor = '#f5576c'
                e.target.style.boxShadow = '0 0 0 3px rgba(245, 87, 108, 0.1)'
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
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 87, 108, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 87, 108, 0.4)'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                注册 <ArrowRightOutlined style={{ marginLeft: '8px' }} />
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

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            已有账号？ <Link to="/login" style={{ color: '#f5576c', fontWeight: 500, textDecoration: 'none' }}>
              立即登录
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
