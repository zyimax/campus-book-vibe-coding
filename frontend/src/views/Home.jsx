import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Pagination, Input, Select, Button, Spin, Empty, Tag } from 'antd'
import { SearchOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
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

  const categories = ['Textbook', 'Exam Prep', 'Literature', 'Science', 'Other']

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

  const getCategoryColor = (category) => {
    const colors = {
      'Textbook': 'blue',
      'Exam Prep': 'green',
      'Literature': 'purple',
      'Science': 'orange',
      'Other': 'default'
    }
    return colors[category] || 'default'
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <Input.Search
          placeholder="搜索书籍名称、作者"
          enterButton={<SearchOutlined />}
          size="large"
          style={{ maxWidth: 600 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
        />
        <div style={{ marginTop: 16 }}>
          <Select
            placeholder="选择分类"
            style={{ width: 200 }}
            allowClear
            onChange={handleCategoryChange}
          >
            {categories.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : books.length === 0 ? (
        <Empty description="暂无书籍" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {books.map(book => (
              <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ 
                      height: 200, 
                      background: '#f0f0f0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#999'
                    }}>
                      {book.images ? (
                        <img 
                          src={book.images} 
                          alt={book.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : '暂无图片'}
                    </div>
                  }
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <Card.Meta
                    title={
                      <div style={{ height: 44, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {book.title}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: '18px', color: '#ff4d4f', fontWeight: 'bold', marginBottom: 8 }}>
                          ¥{book.price}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tag color={getCategoryColor(book.category)}>{book.category}</Tag>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            <EyeOutlined /> {book.viewCount || 0}
                          </div>
                        </div>
                        {book.seller && (
                          <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
                            <UserOutlined /> {book.seller.nickname || '未知卖家'}
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Home
