import React, { useEffect, useState } from 'react'
import { Card, Tabs, Table, Tag, Button, message, Space } from 'antd'
import { orderAPI } from '../api'
import { useNavigate } from 'react-router-dom'

const { TabPane } = Tabs

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()

  const fetchOrders = async (status = '') => {
    setLoading(true)
    try {
      const res = await orderAPI.getList({ status })
      setOrders(res.data?.records || res.data?.list || [])
    } catch (error) {
      console.error('获取订单列表失败', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleTabChange = (key) => {
    setActiveTab(key)
    const statusMap = {
      'all': '',
      'pending': 0,
      'paid': 1,
      'shipped': 2,
      'completed': 3,
      'cancelled': 4
    }
    fetchOrders(statusMap[key])
  }

  const handleCancel = async (id) => {
    try {
      await orderAPI.cancel(id)
      message.success('订单已取消')
      fetchOrders(activeTab === 'all' ? '' : activeTab)
    } catch (error) {
      console.error('取消订单失败', error)
    }
  }

  const handleConfirm = async (id) => {
    try {
      await orderAPI.confirm(id)
      message.success('已确认收货')
      fetchOrders(activeTab === 'all' ? '' : activeTab)
    } catch (error) {
      console.error('确认收货失败', error)
    }
  }

  const getStatusTag = (status) => {
    const statusMap = {
      0: { text: '待付款', color: 'orange' },
      1: { text: '待发货', color: 'blue' },
      2: { text: '待收货', color: 'cyan' },
      3: { text: '已完成', color: 'green' },
      4: { text: '已取消', color: 'red' }
    }
    const { text, color } = statusMap[status] || { text: '未知', color: 'default' }
    return <Tag color={color}>{text}</Tag>
  }

  const columns = [
    { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
    { title: '书籍名称', dataIndex: ['book', 'title'], key: 'book_title' },
    { title: '价格', dataIndex: 'total_price', key: 'total_price', render: (price) => `¥${price}` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => getStatusTag(status) },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/order/${record.id}`)}>
            详情
          </Button>
          {record.status === 0 && (
            <Button type="link" danger onClick={() => handleCancel(record.id)}>
              取消
            </Button>
          )}
          {record.status === 2 && (
            <Button type="link" onClick={() => handleConfirm(record.id)}>
              确认收货
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <Card title="我的订单">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="全部订单" key="all" />
        <TabPane tab="待付款" key="pending" />
        <TabPane tab="待发货" key="paid" />
        <TabPane tab="待收货" key="shipped" />
        <TabPane tab="已完成" key="completed" />
        <TabPane tab="已取消" key="cancelled" />
      </Tabs>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
      />
    </Card>
  )
}

export default Orders
