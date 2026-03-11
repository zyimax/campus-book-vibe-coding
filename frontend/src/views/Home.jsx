import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Pagination, Input, Select, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { bookAPI } from '../api'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })
  const navigate = useNavigate()

  const fetchBooks = async (page = 1) => {
    setLoading(true)
    try {
      const res = await bookAPI.getList({ page, size: pagination.pageSize })
      setBooks(res.data.list)
      setPagination(prev => ({ ...prev, current: page, total: res.data.total }))
    } catch (error) {
      console.error('获取书籍列表失败', error)
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
    navigate('/search')
  }

  return (
    <div>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <Input.Search
          placeholder="搜索书籍名称、作者"
          enterButton={<SearchOutlined />}
          size="large"
          style={{ maxWidth: 600 }}
          onSearch={handleSearch}
        />
      </div>
      <Row gutter={[16, 16]}>
        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <Card
              hoverable
              cover={<div style={{ height: 200, background: '#f0f0f0' }}>书籍图片</div>}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <Card.Meta
                title={book.title}
                description={`¥${book.price}`}
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
        />
      </div>
    </div>
  )
}

export default Home
