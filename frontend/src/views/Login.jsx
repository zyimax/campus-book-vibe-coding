import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, BookOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { userAPI } from '../api'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await userAPI.login(values)
      const token = res.data?.token || res.data
      localStorage.setItem('token', token)
      message.success('登录成功')
      navigate('/')
    } catch (error) {
      console.error('登录失败', error)
      const errorMsg = error.response?.data?.message || error.message || '登录失败，请检查用户名和密码'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

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
      {/* 装饰性背景 */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />

      <Card style={{
        width: 420,
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: 'none',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 卡片头部 */}
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
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <BookOutlined style={{ fontSize: '36px', color: '#667eea' }} />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '8px'
          }}>
            欢迎回来
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.9)'
          }}>
            登录校园书市，开启您的阅读之旅
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          style={{ padding: '0 16px' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="用户名/邮箱/手机号"
              size="large"
              style={{
                borderRadius: 'var(--radius-md)',
                height: '48px',
                fontSize: '15px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="密码"
              size="large"
              style={{
                borderRadius: 'var(--radius-md)',
                height: '48px',
                fontSize: '15px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: '48px',
                borderRadius: 'var(--radius-md)',
                fontSize: '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              登录 <ArrowRightOutlined style={{ marginLeft: '8px' }} />
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
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: '2px solid #667eea',
                  color: '#667eea'
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
