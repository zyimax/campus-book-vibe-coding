import React, { useState, useCallback } from 'react'
import { Form, Input, Select, InputNumber, Upload, Button, Card, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { bookAPI } from '../api'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input
const { Option } = Select

const categoryOptions = [
  { value: 'Textbook', label: '教材教辅' },
  { value: 'Exam Prep', label: '考试用书' },
  { value: 'Literature', label: '文学小说' },
  { value: 'Science', label: '科学技术' },
  { value: 'Other', label: '其他类别' }
]

const conditionOptions = [
  { value: 'Like New', label: '全新' },
  { value: 'Very Good', label: '很好' },
  { value: 'Good', label: '良好' },
  { value: 'Fair', label: '一般' }
]

const deliveryOptions = [
  { value: '仅自提', label: '仅自提' },
  { value: '仅快递', label: '仅快递' },
  { value: '自提+快递', label: '自提+快递' }
]

function Publish() {
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const navigate = useNavigate()

  const onFinish = useCallback(async (values) => {
    setLoading(true)
    try {
      const images = fileList.map(file => file.response?.data?.url || file.url)
      await bookAPI.publish({ ...values, images: JSON.stringify(images) })
      message.success('发布成功')
      navigate('/')
    } catch (error) {
      console.error('发布失败', error)
      message.error('发布失败，请检查网络连接或稍后重试')
    } finally {
      setLoading(false)
    }
  }, [fileList, navigate])

  const handleUploadChange = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList)
  }, [])

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    listType: 'picture-card',
    fileList,
    onChange: handleUploadChange,
    maxCount: 3,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <span style={{ fontSize: '16px', color: 'var(--error-color)' }}>×</span>
    }
  }

  const renderInput = (placeholder, rules) => (
    <Input 
      placeholder={placeholder} 
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        transition: 'all var(--transition-normal)'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--primary-color)'
        e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--border-light)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )

  const renderSelect = (placeholder, options) => (
    <Select 
      placeholder={placeholder} 
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        transition: 'all var(--transition-normal)'
      }}
    >
      {options.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  )

  return (
    <Card 
      title="发布二手书籍" 
      style={{
        maxWidth: 800, 
        margin: '0 auto',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: 'none',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-primary)'
      }}
      bodyStyle={{ padding: 'var(--spacing-6)' }}
    >
      <Form
        name="publish"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        style={{ maxWidth: '100%' }}
      >
        <Form.Item
          label="书名"
          name="title"
          rules={[
            { required: true, message: '请输入书名' },
            { max: 50, message: '书名不能超过50个字符' }
          ]}
        >
          {renderInput('请输入书名')}
        </Form.Item>
        
        <Form.Item
          label="作者"
          name="author"
          rules={[
            { max: 30, message: '作者名不能超过30个字符' }
          ]}
        >
          {renderInput('请输入作者')}
        </Form.Item>
        
        <Form.Item
          label="ISBN"
          name="isbn"
          rules={[
            { pattern: /^\d{10,13}$/, message: '请输入有效的ISBN码' }
          ]}
        >
          {renderInput('请输入ISBN')}
        </Form.Item>
        
        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          {renderSelect('请选择分类', categoryOptions)}
        </Form.Item>
        
        <Form.Item
          label="成色"
          name="condition"
          rules={[{ required: true, message: '请选择成色' }]}
        >
          {renderSelect('请选择成色', conditionOptions)}
        </Form.Item>
        
        <Form.Item
          label="价格"
          name="price"
          rules={[
            { required: true, message: '请输入价格' },
            { min: 0.01, message: '价格必须大于0' },
            { max: 9999, message: '价格不能超过9999元' }
          ]}
        >
          <InputNumber 
            placeholder="请输入价格" 
            min={0.01} 
            max={9999} 
            step={0.01}
            style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
          />
        </Form.Item>
        
        <Form.Item
          label="库存"
          name="stock"
          initialValue={1}
          rules={[
            { required: true, message: '请输入库存' },
            { min: 1, message: '库存至少为1' },
            { max: 999, message: '库存不能超过999' }
          ]}
        >
          <InputNumber 
            placeholder="请输入库存" 
            min={1} 
            max={999}
            style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
          />
        </Form.Item>
        
        <Form.Item
          label="交易方式"
          name="delivery_type"
          rules={[{ required: true, message: '请选择交易方式' }]}
        >
          {renderSelect('请选择交易方式', deliveryOptions)}
        </Form.Item>
        
        <Form.Item
          label="书籍描述"
          name="description"
          rules={[
            { max: 500, message: '描述不能超过500个字符' }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="请输入书籍描述，包括书籍状态、使用情况等信息"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              transition: 'all var(--transition-normal)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-color)'
              e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </Form.Item>
        
        <Form.Item
          label="书籍图片"
          name="images"
        >
          <Upload {...uploadProps}>
            {fileList.length < 3 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 120,
                border: '2px dashed var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-normal)',
                background: 'var(--bg-tertiary)'
              }}>
                <PlusOutlined style={{ fontSize: '24px', color: 'var(--text-muted)' }} />
                <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  上传图片（最多3张）
                </div>
              </div>
            )}
          </Upload>
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              background: 'var(--primary-gradient)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-3) 0',
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
            发布
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Publish
