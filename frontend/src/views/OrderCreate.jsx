import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Button, message, Select, Form } from 'antd'
import { orderAPI, addressAPI } from '../api'

function OrderCreate() {
  const location = useLocation()
  const navigate = useNavigate()
  const { book } = location.state || {}
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)

  React.useEffect(() => {
    if (!book) {
      message.error('请先选择要购买的书籍')
      navigate(-1)
      return
    }
    fetchAddresses()
  }, [book])

  const fetchAddresses = async () => {
    try {
      const res = await addressAPI.getList()
      const addressList = res.data?.records || res.data?.list || res.data || []
      setAddresses(addressList)
      if (addressList.length > 0) {
        setSelectedAddress(addressList[0].id)
      }
    } catch (error) {
      console.error('获取地址列表失败', error)
    }
  }

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      message.error('请选择收货地址')
      return
    }

    setLoading(true)
    try {
      const res = await orderAPI.create({
        bookId: book.id,
        addressId: selectedAddress
      })
      message.success('订单创建成功')
      navigate(`/order/${res.data.id}`)
    } catch (error) {
      console.error('创建订单失败', error)
      const errorMsg = error.response?.data?.message || error.message || '创建订单失败'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (!book) {
    return null
  }

  return (
    <Card title="确认订单">
      <Descriptions title="书籍信息" bordered style={{ marginBottom: 20 }}>
        <Descriptions.Item label="书名">{book.title}</Descriptions.Item>
        <Descriptions.Item label="作者">{book.author}</Descriptions.Item>
        <Descriptions.Item label="价格">¥{book.price}</Descriptions.Item>
        <Descriptions.Item label="成色">{book.condition}</Descriptions.Item>
        <Descriptions.Item label="卖家">{book.seller?.nickname || '未知'}</Descriptions.Item>
      </Descriptions>

      <Card title="选择收货地址" style={{ marginBottom: 20 }}>
        {addresses.length > 0 ? (
          <Form.Item label="收货地址">
            <Select
              style={{ width: '100%' }}
              value={selectedAddress}
              onChange={setSelectedAddress}
              placeholder="请选择收货地址"
            >
              {addresses.map(addr => (
                <Select.Option key={addr.id} value={addr.id}>
                  {addr.receiver} - {addr.phone} - {addr.address}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <div>
            <p>您还没有收货地址，请先添加</p>
            <Button type="link" onClick={() => navigate('/address')}>
              添加收货地址
            </Button>
          </div>
        )}
      </Card>

      <Card title="订单金额">
        <Descriptions>
          <Descriptions.Item label="商品金额">¥{book.price}</Descriptions.Item>
          <Descriptions.Item label="运费">¥0.00</Descriptions.Item>
          <Descriptions.Item label="合计" style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            ¥{book.price}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <Button style={{ marginRight: 10 }} onClick={() => navigate(-1)}>
          取消
        </Button>
        <Button type="primary" loading={loading} onClick={handleCreateOrder} disabled={addresses.length === 0}>
          提交订单
        </Button>
      </div>
    </Card>
  )
}

export default OrderCreate
