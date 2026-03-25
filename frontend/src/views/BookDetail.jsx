import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Descriptions, Image, message, Spin, Empty, Divider } from 'antd'
import { bookAPI } from '../api'

function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchBookDetail = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookAPI.getDetail(id)
      setBook(res.data)
    } catch (error) {
      console.error('获取书籍详情失败', error)
      setError('获取书籍详情失败，请稍后重试')
      message.error('获取书籍详情失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBookDetail()
  }, [fetchBookDetail])

  const handleBuy = useCallback(() => {
    if (book) {
      navigate('/order/create', { state: { book } })
    }
  }, [navigate, book])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <Spin size="large" style={{ color: 'var(--primary-color)' }} />
        <div style={{ 
          marginLeft: 'var(--spacing-4)', 
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-lg)'
        }}>正在加载书籍详情...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 'var(--spacing-20)',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <Empty 
          description={
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              {error}
            </div>
          } 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button 
          type="primary" 
          onClick={fetchBookDetail}
          style={{ marginTop: 'var(--spacing-4)' }}
        >
          重新加载
        </Button>
      </div>
    )
  }

  if (!book) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 'var(--spacing-20)',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <Empty 
          description={
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              书籍不存在或已被删除
            </div>
          } 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button 
          type="primary" 
          onClick={() => navigate('/')}
          style={{ marginTop: 'var(--spacing-4)' }}
        >
          返回首页
        </Button>
      </div>
    )
  }

  const renderBookImages = () => {
    if (!book.images) {
      return (
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          padding: 'var(--spacing-8)',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          暂无图片
        </div>
      )
    }

    const images = Array.isArray(book.images) ? book.images : JSON.parse(book.images)
    return images.map((img, index) => (
      <Image 
        key={index} 
        src={img} 
        width={200} 
        style={{ 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
    ))
  }

  return (
    <Card 
      style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: 'none',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-primary)'
      }}
      bodyStyle={{ padding: 'var(--spacing-6)' }}
    >
      <h1 style={{
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--font-bold)',
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-6)',
        textAlign: 'center'
      }}>
        {book.title}
      </h1>

      <Descriptions 
        bordered 
        style={{
          marginBottom: 'var(--spacing-8)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        <Descriptions.Item label="作者" span={2}>{book.author || '未知作者'}</Descriptions.Item>
        <Descriptions.Item label="ISBN" span={2}>{book.isbn || '未知'}</Descriptions.Item>
        <Descriptions.Item label="分类" span={2}>{book.category || '未分类'}</Descriptions.Item>
        <Descriptions.Item label="成色" span={2}>{book.condition || '未知'}</Descriptions.Item>
        <Descriptions.Item label="价格" span={2} style={{ color: 'var(--error-color)', fontWeight: 'var(--font-bold)' }}>¥{book.price}</Descriptions.Item>
        <Descriptions.Item label="库存" span={2}>{book.stock || 0}</Descriptions.Item>
        <Descriptions.Item label="交易方式" span={2}>{book.delivery_type || '未知'}</Descriptions.Item>
        <Descriptions.Item label="卖家" span={2}>{book.seller?.nickname || '未知卖家'}</Descriptions.Item>
        <Descriptions.Item label="发布时间" span={4}>{book.created_at ? new Date(book.created_at).toLocaleString() : '未知时间'}</Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: 'var(--spacing-6) 0' }} />

      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h3 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-4)'
        }}>书籍描述</h3>
        <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          padding: 'var(--spacing-4)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)'
        }}>
          {book.description || '暂无描述'}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h3 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-4)'
        }}>书籍图片</h3>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-4)', 
          flexWrap: 'wrap',
          padding: 'var(--spacing-4)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)'
        }}>
          {renderBookImages()}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 'var(--spacing-4)',
        marginTop: 'var(--spacing-8)'
      }}>
        <Button
          type="primary"
          size="large"
          onClick={handleBuy}
          style={{
            background: 'var(--primary-gradient)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '0 var(--spacing-8)',
            height: '56px',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            transition: 'all var(--transition-normal)',
            boxShadow: 'var(--shadow-lg)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          }}
        >
          立即购买
        </Button>
        <Button
          type="default"
          size="large"
          onClick={() => navigate('/')}
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '0 var(--spacing-8)',
            height: '56px',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-medium)',
            transition: 'all var(--transition-normal)',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          返回首页
        </Button>
      </div>
    </Card>
  )
}

export default BookDetail
