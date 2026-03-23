import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Avatar, Upload, message, Divider, List } from 'antd'
import { UserOutlined, UploadOutlined, EnvironmentOutlined, ShoppingOutlined } from '@ant-design/icons'
import { userAPI } from '../api'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const fetchProfile = async () => {
    try {
      const res = await userAPI.getProfile()
      setUser(res.data)
      form.setFieldsValue(res.data)
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdate = async (values) => {
    setLoading(true)
    try {
      await userAPI.updateProfile(values)
      message.success('更新成功')
      fetchProfile()
    } catch (error) {
      console.error('更新失败', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadProps = {
    name: 'file',
    action: '/api/upload/image',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    showUploadList: false,
    onChange: async (info) => {
      if (info.file.status === 'done') {
        const avatarUrl = info.file.response?.data?.url
        if (avatarUrl) {
          await userAPI.updateProfile({ avatar: avatarUrl })
          message.success('头像上传成功')
          fetchProfile()
        } else {
          message.error('头像上传失败')
        }
      } else if (info.file.status === 'error') {
        message.error('头像上传失败')
      }
    }
  }

  const menuItems = [
    {
      icon: <ShoppingOutlined />,
      title: '我的订单',
      description: '查看订单状态和交易记录',
      onClick: () => navigate('/orders')
    },
    {
      icon: <EnvironmentOutlined />,
      title: '收货地址',
      description: '管理收货地址信息',
      onClick: () => navigate('/address')
    }
  ]

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Card title="个人中心" style={{ flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Avatar
            size={100}
            src={user?.avatar}
            icon={<UserOutlined />}
            style={{ marginBottom: 10 }}
          />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="常用功能" style={{ width: 300 }}>
        <List
          itemLayout="horizontal"
          dataSource={menuItems}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={item.onClick}
            >
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Profile
