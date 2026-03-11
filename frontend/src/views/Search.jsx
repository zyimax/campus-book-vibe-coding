import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Row, Col, Pagination, Input, Select, Button, Space } from 'antd'

const { Option } = Select

function Search() {
  const [searchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: '',
    minPrice: null,
    maxPrice: null,
    condition: ''
  })

  const handleSearch = async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        page,
        size: pagination.pageSize,
        ...filters
      }
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })
      const res = await fetch(`/api/books/search?${new URLSearchParams(params)}`)
      const data = await res.json()
      setBooks(data.data.list)
      setPagination(prev => ({ ...prev, current: page, total: data.data.total }))
    } catch (error) {
      console.error('搜索失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    handleSearch(page)
  }

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="搜索书籍名称"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
          <Space>
            <Select
              placeholder="选择分类"
              style={{ width: 150 }}
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value })}
            >
              <Option value="">全部</Option>
              <Option value="教材类">教材类</Option>
              <Option value="考研资料">考研资料</Option>
              <Option value="课外阅读">课外阅读</Option>
              <Option value="其他">其他</Option>
            </Select>
            <Select
              placeholder="选择成色"
              style={{ width: 150 }}
              value={filters.condition}
              onChange={(value) => setFilters({ ...filters, condition: value })}
            >
              <Option value="">全部</Option>
              <Option value="全新">全新</Option>
              <Option value="九成新">九成新</Option>
              <Option value="八成新">八成新</Option>
              <Option value="七成新">七成新</Option>
              <Option value="及以下">及以下</Option>
            </Select>
            <Button type="primary" onClick={() => handleSearch(1)}>
              搜索
            </Button>
          </Space>
        </Space>
      </Card>
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

export default Search
