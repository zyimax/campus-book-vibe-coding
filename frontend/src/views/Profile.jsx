import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Avatar, Upload, message } from 'antd'
import { UserOutlined, UploadOutlined } from '@ant-design/icons'
import { userAPI } from '../api'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

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
    action: '/api/upload',
    showUploadList: false,
    onChange: async (info) => {
      if (info.file.status === 'done') {
        const avatarUrl = info.file.response?.data?.url
        await userAPI.updateProfile({ avatar: avatarUrl })
        message.success('头像上传成功')
        fetchProfile()
      }
    }
  }

  return (
    <Card title="个人中心">
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
  )
}

export default Profile
