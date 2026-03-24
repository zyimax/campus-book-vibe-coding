import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Pagination, Input, Select, Button, Spin, Empty, Tag, Badge, Tooltip } from 'antd'
import { SearchOutlined, EyeOutlined, UserOutlined, BookOutlined, FireOutlined, StarOutlined } from '@ant-design/icons'
import { bookAPI } from '../api'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const navigate = useNavigate()

  const categories = [
    { key: 'Textbook', label: '教材教辅', color: '#3b82f6', icon: '📚' },
    { key: 'Exam Prep', label: '考试用书', color: '#10b981', icon: '📝' },
    { key: 'Literature', label: '文学小说', color: '#8b5cf6', icon: '📖' },
    { key: 'Science', label: '科学技术', color: '#f59e0b', icon: '🔬' },
    { key: 'Other', label: '其他类别', color: '#6b7280', icon: '📦' }
  ]

  const fetchBooks = async (page = 1) => {
    setLoading(true)
    try {
      const res = await bookAPI.getList({ page, size: pagination.pageSize })
      const bookList = res.data?.records || res.data?.list || []
      const total = res.data?.total || 0
      setBooks(bookList)
      setPagination(prev => ({ ...prev, current: page, total }))
    } catch (error) {
      console.error('获取书籍列表失败', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handlePageChange = (page) => {
    fetchBooks(page)
  }

  const handleSearch = () => {
    navigate('/search', { state: { keyword, category: selectedCategory } })
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const getCategoryInfo = (categoryKey) => {
    return categories.find(cat => cat.key === categoryKey) || { label: categoryKey, color: '#6b7280', icon: '📦' }
  }

  const getConditionColor = (condition) => {
    const colors = {
      'Like New': '#10b981',
      'Very Good': '#3b82f6',
      'Good': '#f59e0b',
      'Fair': '#6b7280'
    }
    return colors[condition] || '#6b7280'
  }

  const getConditionLabel = (condition) => {
    const labels = {
      'Like New': '全新',
      'Very Good': '很好',
      'Good': '良好',
      'Fair': '一般'
    }
    return labels[condition] || condition
  }

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* 英雄区域 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '60px 40px',
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 装饰性背景元素 */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 800,
            color: 'white',
            marginBottom: '16px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            发现校园好书
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px'
          }}>
            让闲置书籍流转起来，与志同道合的书友相遇
          </p>
          
          {/* 搜索框 */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '8px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '8px'
          }}>
            <Input
              placeholder="搜索书名、作者、ISBN..."
              size="large"
              style={{
                flex: 1,
                border: 'none',
                fontSize: '16px'
              }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                background: 'var(--primary-gradient)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0 32px',
                height: '44px',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              搜索
            </Button>
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Button
            type={selectedCategory === '' ? 'primary' : 'default'}
            size="large"
            onClick={() => handleCategoryChange('')}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '0 24px',
              height: '44px',
              fontSize: '15px',
              fontWeight: 500,
              background: selectedCategory === '' ? 'var(--primary-gradient)' : 'white',
              border: selectedCategory === '' ? 'none' : '1px solid var(--border-color)',
              boxShadow: selectedCategory === '' ? 'var(--shadow-md)' : 'var(--shadow-sm)'
            }}
          >
            全部书籍
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.key}
              type={selectedCategory === cat.key ? 'primary' : 'default'}
              size="large"
              onClick={() => handleCategoryChange(cat.key)}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0 24px',
                height: '44px',
                fontSize: '15px',
                fontWeight: 500,
                background: selectedCategory === cat.key ? cat.color : 'white',
                border: selectedCategory === cat.key ? 'none' : '1px solid var(--border-color)',
                boxShadow: selectedCategory === cat.key ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                color: selectedCategory === cat.key ? 'white' : 'var(--text-primary)'
              }}
            >
              <span style={{ marginRight: '6px' }}>{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 书籍列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>正在加载书籍...</div>
        </div>
      ) : books.length === 0 ? (
        <Empty 
          description="暂无书籍" 
          style={{ padding: '80px' }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {books.map((book, index) => {
              const categoryInfo = getCategoryInfo(book.category)
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/book/${book.id}`)}
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: 'none',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    bodyStyle={{ padding: '16px' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }}
                    cover={
                      <div style={{ 
                        height: 220, 
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {book.images && book.images.length > 0 ? (
                          <img 
                            src={typeof book.images === 'string' ? book.images : book.images[0]} 
                            alt={book.title} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          />
                        ) : (
                          <BookOutlined style={{ fontSize: '48px', color: 'var(--text-muted)' }} />
                        )}
                        {/* 分类标签 */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: categoryInfo.color,
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '12px',
                          fontWeight: 600,
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          {categoryInfo.icon} {categoryInfo.label}
                        </div>
                        {/* 成色标签 */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(255,255,255,0.95)',
                          color: getConditionColor(book.condition),
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: 600,
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          {getConditionLabel(book.condition)}
                        </div>
                      </div>
                    }
                  >
                    <div>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                        height: '44px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4'
                      }}>
                        {book.title}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          fontSize: '22px',
                          fontWeight: 700,
                          color: '#ef4444'
                        }}>
                          ¥{book.price}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          textDecoration: 'line-through'
                        }}>
                          ¥{(book.price * 1.5).toFixed(0)}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-light)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: 'var(--text-secondary)'
                        }}>
                          <EyeOutlined />
                          <span>{book.viewCount || 0}</span>
                        </div>
                        {book.seller && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: 'var(--text-secondary)'
                          }}>
                            <UserOutlined />
                            <span>{book.seller.nickname || '未知卖家'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
          
          {/* 分页 */}
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              style={{
                padding: '16px 24px',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                display: 'inline-flex',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Home
