import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, message, Steps, Result } from 'antd'
import { orderAPI } from '../api'

const { Step } = Steps

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchOrderDetail = async () => {
    if (!id) {
      message.error('订单ID无效')
      return
    }
    setLoading(true)
    try {
      const res = await orderAPI.getDetail(id)
      if (res.data) {
        setOrder(res.data)
      } else {
        message.error('订单不存在')
        navigate('/orders')
      }
    } catch (error) {
      console.error('获取订单详情失败', error)
      const errorMsg = error.response?.data?.message || error.message || '获取订单详情失败'
      message.error(errorMsg)
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const handleCancel = async () => {
    try {
      await orderAPI.cancel(id)
      message.success('订单已取消')
      fetchOrderDetail()
    } catch (error) {
      console.error('取消订单失败', error)
      const errorMsg = error.response?.data?.message || error.message || '取消订单失败'
      message.error(errorMsg)
    }
  }

  const handleConfirm = async () => {
    try {
      await orderAPI.confirm(id)
      message.success('已确认收货')
      fetchOrderDetail()
    } catch (error) {
      console.error('确认收货失败', error)
      const errorMsg = error.response?.data?.message || error.message || '确认收货失败'
      message.error(errorMsg)
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

  const getCurrentStep = (status) => {
    const stepMap = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: -1
    }
    return stepMap[status] !== undefined ? stepMap[status] : 0
  }

  if (loading) {
    return (
      <Card loading={true}>
        <div style={{ height: 300 }} />
      </Card>
    )
  }

  if (!order) {
    return (
      <Result
        status="404"
        title="订单不存在"
        subTitle="该订单可能已被删除或您没有权限查看"
        extra={
          <Button type="primary" onClick={() => navigate('/orders')}>
            返回订单列表
          </Button>
        }
      />
    )
  }

  return (
    <Card title="订单详情" loading={loading}>
      <Steps current={getCurrentStep(order.status)} style={{ marginBottom: 30 }}>
        <Step title="待付款" />
        <Step title="待发货" />
        <Step title="待收货" />
        <Step title="已完成" />
      </Steps>
      <Descriptions bordered>
        <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
        <Descriptions.Item label="订单状态">{getStatusTag(order.status)}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{order.createdAt}</Descriptions.Item>
        <Descriptions.Item label="书籍名称">{order.book?.title}</Descriptions.Item>
        <Descriptions.Item label="作者">{order.book?.author}</Descriptions.Item>
        <Descriptions.Item label="价格">¥{order.totalPrice}</Descriptions.Item>
        <Descriptions.Item label="收货人">{order.address?.receiver}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{order.address?.phone}</Descriptions.Item>
        <Descriptions.Item label="收货地址">{order.address?.address}</Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 20 }}>
        {order.status === 0 && (
          <Button type="primary" danger onClick={handleCancel}>
            取消订单
          </Button>
        )}
        {order.status === 2 && (
          <Button type="primary" onClick={handleConfirm}>
            确认收货
          </Button>
        )}
      </div>
    </Card>
  )
}

export default OrderDetail
