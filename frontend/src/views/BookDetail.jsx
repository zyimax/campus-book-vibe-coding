import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Descriptions, Image, message } from 'antd'
import { bookAPI, orderAPI } from '../api'

function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchBookDetail = async () => {
    try {
      const res = await bookAPI.getDetail(id)
      setBook(res.data)
    } catch (error) {
      console.error('获取书籍详情失败', error)
    }
  }

  useEffect(() => {
    fetchBookDetail()
  }, [id])

  const handleBuy = () => {
    navigate('/order/create', { state: { book } })
  }

  if (!book) return <div>加载中...</div>

  return (
    <Card>
      <Descriptions title={book.title} bordered>
        <Descriptions.Item label="作者">{book.author}</Descriptions.Item>
        <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
        <Descriptions.Item label="分类">{book.category}</Descriptions.Item>
        <Descriptions.Item label="成色">{book.condition}</Descriptions.Item>
        <Descriptions.Item label="价格">¥{book.price}</Descriptions.Item>
        <Descriptions.Item label="库存">{book.stock}</Descriptions.Item>
        <Descriptions.Item label="交易方式">{book.delivery_type}</Descriptions.Item>
        <Descriptions.Item label="卖家">{book.seller?.nickname}</Descriptions.Item>
        <Descriptions.Item label="发布时间">{book.created_at}</Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 20 }}>
        <h3>书籍描述</h3>
        <p>{book.description}</p>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>书籍图片</h3>
        {book.images && JSON.parse(book.images).map((img, index) => (
          <Image key={index} src={img} width={200} style={{ marginRight: 10 }} />
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <Button type="primary" size="large" onClick={handleBuy}>
          立即购买
        </Button>
      </div>
    </Card>
  )
}

export default BookDetail
