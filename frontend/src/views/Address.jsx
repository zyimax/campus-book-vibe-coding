import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Radio, message, Space, Empty } from 'antd'
import { addressAPI } from '../api'

function Address() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [form] = Form.useForm()

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const res = await addressAPI.getList()
      const addressList = res.data?.list || res.data?.records || res.data || []
      setAddresses(addressList)
    } catch (error) {
      console.error('获取地址列表失败', error)
      const errorMsg = error.response?.data?.message || error.message || '获取地址列表失败'
      message.error(errorMsg)
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleAdd = () => {
    setEditingAddress(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingAddress(record)
    form.setFieldsValue({
      ...record,
      isDefault: record.isDefault || 0
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await addressAPI.delete(id)
      message.success('删除成功')
      fetchAddresses()
    } catch (error) {
      console.error('删除地址失败', error)
      const errorMsg = error.response?.data?.message || error.message || '删除地址失败'
      message.error(errorMsg)
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await addressAPI.setDefault(id)
      message.success('设置成功')
      fetchAddresses()
    } catch (error) {
      console.error('设置默认地址失败', error)
      const errorMsg = error.response?.data?.message || error.message || '设置默认地址失败'
      message.error(errorMsg)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingAddress) {
        await addressAPI.update(editingAddress.id, values)
        message.success('更新成功')
      } else {
        await addressAPI.add(values)
        message.success('添加成功')
      }
      setModalVisible(false)
      fetchAddresses()
    } catch (error) {
      console.error('操作失败', error)
      const errorMsg = error.response?.data?.message || error.message || '操作失败'
      message.error(errorMsg)
    }
  }

  const columns = [
    { title: '收货人', dataIndex: 'receiver', key: 'receiver' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '收货地址', dataIndex: 'address', key: 'address' },
    {
      title: '默认地址',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault) => (isDefault === 1 ? '是' : '否')
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.isDefault !== 1 && (
            <Button type="link" onClick={() => handleSetDefault(record.id)}>
              设为默认
            </Button>
          )}
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Card
      title="收货地址管理"
      extra={<Button type="primary" onClick={handleAdd}>新增地址</Button>}
    >
      <Table
        columns={columns}
        dataSource={addresses}
        loading={loading}
        rowKey="id"
        locale={{ emptyText: <Empty description="暂无收货地址" /> }}
      />
      <Modal
        title={editingAddress ? '编辑地址' : '新增地址'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="收货人"
            name="receiver"
            rules={[{ required: true, message: '请输入收货人' }]}
          >
            <Input placeholder="请输入收货人" />
          </Form.Item>
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            label="收货地址"
            name="address"
            rules={[{ required: true, message: '请输入收货地址' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入收货地址" />
          </Form.Item>
          <Form.Item
            label="设为默认地址"
            name="isDefault"
            initialValue={0}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Address
