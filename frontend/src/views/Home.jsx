import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, Row, Col, Pagination, Input, Button, Spin, Empty, message } from 'antd'
import { SearchOutlined, EyeOutlined, BookOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { bookAPI } from '../api'
import { useNavigate } from 'react-router-dom'

const categories = [
  { key: 'Textbook', label: '教材教辅', color: '#3b82f6', icon: '📚' },
  { key: 'Exam Prep', label: '考试用书', color: '#10b981', icon: '📝' },
  { key: 'Literature', label: '文学小说', color: '#8b5cf6', icon: '📖' },
  { key: 'Science', label: '科学技术', color: '#f59e0b', icon: '🔬' },
  { key: 'Other', label: '其他类别', color: '#6b7280', icon: '📦' }
]

const conditionConfig = {
  colors: {
    'Like New': '#10b981',
    'Very Good': '#3b82f6',
    'Good': '#f59e0b',
    'Fair': '#6b7280'
  },
  labels: {
    'Like New': '全新',
    'Very Good': '很好',
    'Good': '良好',
    'Fair': '一般'
  }
}

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const navigate = useNavigate()

  const fetchBooks = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await bookAPI.getList({ page, size: pagination.pageSize })
      const bookList = res.data?.records || res.data?.list || []
      const total = res.data?.total || 0
      setBooks(bookList)
      setPagination(prev => ({ ...prev, current: page, total }))
    } catch (error) {
      console.error('获取书籍列表失败', error)
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请稍后重试')
      } else {
        message.error('获取书籍列表失败，请检查网络连接')
      }
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [pagination.pageSize])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handlePageChange = useCallback((page) => {
    fetchBooks(page)
  }, [fetchBooks])

  const handleSearch = useCallback(() => {
    navigate('/search', { state: { keyword, category: selectedCategory } })
  }, [navigate, keyword, selectedCategory])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
  }, [])

  const getCategoryInfo = useCallback((categoryKey) => {
    return categories.find(cat => cat.key === categoryKey) || { label: categoryKey, color: '#6b7280', icon: '📦' }
  }, [])

  const getConditionColor = useCallback((condition) => {
    return conditionConfig.colors[condition] || '#6b7280'
  }, [])

  const getConditionLabel = useCallback((condition) => {
    return conditionConfig.labels[condition] || condition
  }, [])

  const renderCategoryButton = useCallback((cat) => {
    const isActive = selectedCategory === cat.key
    return (
      <Button
        key={cat.key}
        type={isActive ? 'primary' : 'default'}
        size="large"
        onClick={() => handleCategoryChange(cat.key)}
        style={{
          borderRadius: 'var(--radius-full)',
          padding: '0 var(--spacing-6)',
          height: '48px',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-medium)',
          background: isActive ? cat.color : 'var(--bg-tertiary)',
          border: 'none',
          boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          color: isActive ? 'white' : 'var(--text-primary)',
          transition: 'all var(--transition-normal)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = isActive ? 'var(--shadow-lg)' : 'var(--shadow-md)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)'
        }}
      >
        <span style={{ marginRight: 'var(--spacing-2)' }}>{cat.icon}</span>
        {cat.label}
      </Button>
    )
  }, [selectedCategory, handleCategoryChange])

  const renderBookCard = useCallback((book) => {
    const categoryInfo = getCategoryInfo(book.category)
    return (
      <Col xs={24} sm={12} md={8} lg={6} key={book.id} className="animate-fade-in">
        <Card
          hoverable
          onClick={() => navigate(`/book/${book.id}`)}
          style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: 'none',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            background: 'var(--bg-primary)',
            position: 'relative'
          }}
          bodyStyle={{ padding: 'var(--spacing-4)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-2xl)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
          cover={
            <div style={{ 
              height: 240, 
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
            }}>
              {book.images && book.images.length > 0 ? (
                <img 
                  src={`C:\\Users\\zheng\\Documents\\GitHub\\VibeCoding\\CampusBook\\uploads\\books\\${typeof book.images === 'string' ? book.images : book.images[0]}`} 
                  alt={book.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  padding: 'var(--spacing-4)'
                }}>
                  <BookOutlined style={{ fontSize: '64px', color: 'var(--text-muted)' }} />
                  <div style={{ 
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center'
                  }}>暂无封面</div>
                </div>
              )}
              <div style={{
                position: 'absolute',
                top: 'var(--spacing-3)',
                left: 'var(--spacing-3)',
                background: categoryInfo.color,
                color: 'white',
                padding: 'var(--spacing-1) var(--spacing-3)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition-normal)'
              }}>
                {categoryInfo.icon} {categoryInfo.label}
              </div>
              <div style={{
                position: 'absolute',
                top: 'var(--spacing-3)',
                right: 'var(--spacing-3)',
                background: 'rgba(255,255,255,0.95)',
                color: getConditionColor(book.condition),
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition-normal)'
              }}>
                {getConditionLabel(book.condition)}
              </div>
              {book.viewCount && book.viewCount > 100 && (
                <div style={{
                  position: 'absolute',
                  bottom: 'var(--spacing-3)',
                  left: 'var(--spacing-3)',
                  background: 'rgba(239, 68, 68, 0.95)',
                  color: 'white',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  animation: 'pulse 2s infinite'
                }}>
                  <FireOutlined style={{ fontSize: '12px' }} />
                  热门
                </div>
              )}
            </div>
          }
        >
          <div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-2)',
              height: '52px',
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
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-3)',
              height: '36px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {book.author || '未知作者'}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--spacing-2)',
              marginBottom: 'var(--spacing-4)'
            }}>
              <span style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--error-color)'
              }}>
                ¥{book.price}
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
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
              paddingTop: 'var(--spacing-3)',
              borderTop: '1px solid var(--border-light)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)'
              }}>
                <EyeOutlined style={{ fontSize: '14px' }} />
                <span>{book.viewCount || 0} 浏览</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)'
              }}>
                <ClockCircleOutlined style={{ fontSize: '14px' }} />
                <span>{book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '未知时间'}</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    )
  }, [navigate, getCategoryInfo, getConditionColor, getConditionLabel])

  const renderAllBooksButton = useCallback(() => {
    const isActive = selectedCategory === ''
    return (
      <Button
        type={isActive ? 'primary' : 'default'}
        size="large"
        onClick={() => handleCategoryChange('')}
        style={{
          borderRadius: 'var(--radius-full)',
          padding: '0 var(--spacing-6)',
          height: '48px',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-medium)',
          background: isActive ? 'var(--primary-gradient)' : 'var(--bg-tertiary)',
          border: 'none',
          boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          color: isActive ? 'white' : 'var(--text-primary)',
          transition: 'all var(--transition-normal)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = isActive ? 'var(--shadow-lg)' : 'var(--shadow-md)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)'
        }}
      >
        全部书籍
      </Button>
    )
  }, [selectedCategory, handleCategoryChange])

  return (
    <div style={{ padding: '0 0 var(--spacing-12)' }}>
      <div className="hero" style={{ 
        marginBottom: 'var(--spacing-10)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--spacing-16) var(--spacing-8)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in" style={{ 
            fontSize: 'var(--text-4xl)',
            marginBottom: 'var(--spacing-4)'
          }}>发现校园好书</h1>
          <p className="hero-subtitle animate-fade-in" style={{ 
            animationDelay: '0.2s',
            fontSize: 'var(--text-xl)',
            marginBottom: 'var(--spacing-8)'
          }}>让闲置书籍流转起来，与书友相遇</p>

          <div className="hero-search animate-fade-in" style={{ 
            animationDelay: '0.4s',
            maxWidth: '700px',
            margin: '0 auto',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--spacing-2)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <Input
              placeholder="搜索书名、作者、ISBN..."
              size="large"
              style={{
                flex: 1,
                border: 'none',
                fontSize: 'var(--text-lg)',
                transition: 'all var(--transition-normal)',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 'var(--radius-full)',
                padding: '0 var(--spacing-6)'
              }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                e.target.style.background = 'rgba(255,255,255,1)'
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none'
                e.target.style.background = 'rgba(255,255,255,0.95)'
              }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                background: 'var(--primary-gradient)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0 var(--spacing-8)',
                height: '52px',
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
              搜索
            </Button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-10)' }}>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-3)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: 'var(--spacing-6)',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}>
          {renderAllBooksButton()}
          {categories.map(renderCategoryButton)}
        </div>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-20)',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Spin size="large" style={{ color: 'var(--primary-color)' }} />
          <div style={{ 
            marginTop: 'var(--spacing-4)', 
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-lg)'
          }}>正在加载书籍...</div>
        </div>
      ) : books.length === 0 ? (
        <Empty 
          description={
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              暂无书籍
            </div>
          } 
          style={{ 
            padding: 'var(--spacing-20)',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)'
          }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <Row gutter={[24, 32]}>
            {books.map(renderBookCard)}
          </Row>
          
          <div style={{ 
            marginTop: 'var(--spacing-12)', 
            textAlign: 'center'
          }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              style={{
                padding: 'var(--spacing-4) var(--spacing-6)',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-xl)',
                display: 'inline-flex',
                boxShadow: 'var(--shadow-md)'
              }}
              itemStyle={{
                borderRadius: 'var(--radius-md)',
                margin: '0 var(--spacing-1)',
                transition: 'all var(--transition-normal)'
              }}
              prevIcon={<span style={{ fontSize: '16px' }}>‹</span>}
              nextIcon={<span style={{ fontSize: '16px' }}>›</span>}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Home
