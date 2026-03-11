import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Pagination } from 'antd'
import { bookAPI } from '../api'

function Category() {
  const { type } = useParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })

  const fetchBooks = async (page = 1) => {
    setLoading(true)
    try {
      const res = await bookAPI.getCategory(type, { page, size: pagination.pageSize })
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
  }, [type])

  const handlePageChange = (page) => {
    fetchBooks(page)
  }

  return (
    <div>
      <h2>{type}</h2>
      <Row gutter={[16, 16]}>
        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <Card
              hoverable
              cover={<div style={{ height: 200, background: '#f0f0f0' }}>书籍图片</div>}
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

export default Category
