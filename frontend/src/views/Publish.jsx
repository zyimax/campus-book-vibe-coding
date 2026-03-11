import React, { useState } from 'react'
import { Form, Input, Select, InputNumber, Upload, Button, Card, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { bookAPI } from '../api'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input
const { Option } = Select

function Publish() {
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const images = fileList.map(file => file.response?.data?.url || file.url)
      await bookAPI.publish({ ...values, images: JSON.stringify(images) })
      message.success('发布成功')
      navigate('/')
    } catch (error) {
      console.error('发布失败', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    listType: 'picture-card',
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
    maxCount: 3
  }

  return (
    <Card title="发布二手书籍" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        name="publish"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="书名"
          name="title"
          rules={[{ required: true, message: '请输入书名' }]}
        >
          <Input placeholder="请输入书名" />
        </Form.Item>
        <Form.Item
          label="作者"
          name="author"
        >
          <Input placeholder="请输入作者" />
        </Form.Item>
        <Form.Item
          label="ISBN"
          name="isbn"
        >
          <Input placeholder="请输入ISBN" />
        </Form.Item>
        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="请选择分类">
            <Option value="教材类">教材类</Option>
            <Option value="考研资料">考研资料</Option>
            <Option value="课外阅读">课外阅读</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="成色"
          name="condition"
          rules={[{ required: true, message: '请选择成色' }]}
        >
          <Select placeholder="请选择成色">
            <Option value="全新">全新</Option>
            <Option value="九成新">九成新</Option>
            <Option value="八成新">八成新</Option>
            <Option value="七成新">七成新</Option>
            <Option value="及以下">及以下</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="价格"
          name="price"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber placeholder="请输入价格" min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="库存"
          name="stock"
          initialValue={1}
          rules={[{ required: true, message: '请输入库存' }]}
        >
          <InputNumber placeholder="请输入库存" min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="交易方式"
          name="delivery_type"
          rules={[{ required: true, message: '请选择交易方式' }]}
        >
          <Select placeholder="请选择交易方式">
            <Option value="仅自提">仅自提</Option>
            <Option value="仅快递">仅快递</Option>
            <Option value="自提+快递">自提+快递</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="书籍描述"
          name="description"
        >
          <TextArea rows={4} placeholder="请输入书籍描述" />
        </Form.Item>
        <Form.Item
          label="书籍图片"
          name="images"
        >
          <Upload {...uploadProps}>
            {fileList.length < 3 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            发布
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Publish
