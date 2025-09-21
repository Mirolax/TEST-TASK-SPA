import { useState, useEffect } from 'react'
import type { CharacterForm, Character } from './types'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {Button, Card, Form, Input, Space, Typography, Row, Col, Divider, message } from 'antd'
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { updateCharacter } from '../src/store/slices/charactersSlice.ts'

const { Title, Text } = Typography

export default function CharacterCard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const character = location.state?.character as Character | undefined
  const [form] = Form.useForm()
  const [editMode, setEditMode] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<Character | undefined>(character)

  
  useEffect(() => {
    if (character) {
      setCurrentCharacter(character)
      form.setFieldsValue(character)
    }
  }, [character, form])

  if (!currentCharacter) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={2}>Персонажи не найдены</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Назад
        </Button>
      </div>
    )
  }

  const handleSave = (values: CharacterForm) => {
    const id = currentCharacter.url.split('/').filter(Boolean).pop()
    if (id) {
      dispatch(updateCharacter({ id, data: values }))
      setCurrentCharacter(prev => prev ? { ...prev, ...values } : undefined)
      message.success('Changes saved in Redux!')
    }
    setEditMode(false)
  }

  const handleCancel = () => {
    form.setFieldsValue(currentCharacter) 
    setEditMode(false)
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} type="text">
            Назад
          </Button>

          <Card>
            {editMode ? (
              <Form form={form} initialValues={currentCharacter} onFinish={handleSave} layout="vertical">
                <Title level={3}>Редактировать персонажа</Title>
                
                <Form.Item label="Name" name="name">
                  <Input size="large" />
                </Form.Item>

                <Form.Item label="Height" name="height">
                  <Input size="large" />
                </Form.Item>

                <Form.Item label="Mass" name="mass">
                  <Input size="large" />
                </Form.Item>

                <Form.Item label="Birth Year" name="birth_year">
                  <Input size="large" />
                </Form.Item>

                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Save
                  </Button>
                  <Button onClick={handleCancel} icon={<CloseOutlined />}>
                    Cancel
                  </Button>
                </Space>
              </Form>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                  <Title level={2} style={{ margin: 0 }}>{currentCharacter.name}</Title>
                  <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                </div>

                <Divider />

                <Row gutter={[16, 16]}>
                  <Col span={12}><Text strong>Height:</Text><br /><Text>{currentCharacter.height}</Text></Col>
                  <Col span={12}><Text strong>Mass:</Text><br /><Text>{currentCharacter.mass}</Text></Col>
                  <Col span={12}><Text strong>Birth Year:</Text><br /><Text>{currentCharacter.birth_year}</Text></Col>
                  <Col span={12}><Text strong>Gender:</Text><br /><Text>{currentCharacter.gender}</Text></Col>
                  <Col span={12}><Text strong>Eye Color:</Text><br /><Text>{currentCharacter.eye_color}</Text></Col>
                  <Col span={12}><Text strong>Hair Color:</Text><br /><Text>{currentCharacter.hair_color}</Text></Col>
                </Row>
              </>
            )}
          </Card>
        </Space>
      </div>
    </div>
  )
}