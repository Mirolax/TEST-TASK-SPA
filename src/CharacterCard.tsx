import { useState, useEffect } from 'react'
import type { CharacterForm, Character } from './types'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button, Card, Form, Input, Space, Typography, Row, Col, Divider, message } from 'antd'
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
      <div style={{ 
        padding: '24px', 
        textAlign: 'center', 
        minHeight: '100vh',
        background: '#000',
        color: '#ffe81f'
      }}>
        <Title level={2} style={{ color: '#ffe81f' }}>Персонаж не найден</Title>
        <Button 
          type="primary" 
          onClick={() => navigate('/')}
          style={{ 
            background: '#ffe81f', 
            borderColor: '#ffe81f',
            color: '#000',
            fontWeight: 'bold'
          }}
        >
          Назад к списку
        </Button>
      </div>
    )
  }

  const handleSave = (values: CharacterForm) => {
    const id = currentCharacter.url.split('/').filter(Boolean).pop()
    if (id) {
      dispatch(updateCharacter({ id, data: values }))
      setCurrentCharacter(prev => prev ? { ...prev, ...values } : undefined)
      message.success('Изменения сохранены!')
    }
    setEditMode(false)
  }

  const handleCancel = () => {
    form.setFieldsValue(currentCharacter) 
    setEditMode(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      padding: '24px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')} 
            type="text"
            style={{ 
              color: '#ffe81f',
              padding: '8px 0',
              fontWeight: 'bold'
            }}
          >
            НАЗАД
          </Button>

          <Card
            style={{
              background: '#111',
              border: '2px solid #333',
              borderRadius: '8px'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            {editMode ? (
              <Form 
                form={form} 
                initialValues={currentCharacter} 
                onFinish={handleSave} 
                layout="vertical"
              >
                <Title 
                  level={3} 
                  style={{ 
                    color: '#ffe81f', 
                    textAlign: 'center',
                    marginBottom: '32px',
                    fontFamily: "'Star Jedi', sans-serif"
                  }}
                >
                  РЕДАКТИРОВАТЬ ПЕРСОНАЖА
                </Title>
                
                <Form.Item label={<Text style={{ color: '#ffe81f', fontWeight: 'bold' }}>Имя</Text>} name="name">
                  <Input 
                    size="large" 
                    style={{
                      background: '#222',
                      border: '1px solid #333',
                      color: '#fff',
                      borderRadius: '4px'
                    }}
                  />
                </Form.Item>

                <Form.Item label={<Text style={{ color: '#ffe81f', fontWeight: 'bold' }}>Рост</Text>} name="height">
                  <Input 
                    size="large"
                    style={{
                      background: '#222',
                      border: '1px solid #333',
                      color: '#fff',
                      borderRadius: '4px'
                    }}
                  />
                </Form.Item>

                <Form.Item label={<Text style={{ color: '#ffe81f', fontWeight: 'bold' }}>Вес</Text>} name="mass">
                  <Input 
                    size="large"
                    style={{
                      background: '#222',
                      border: '1px solid #333',
                      color: '#fff',
                      borderRadius: '4px'
                    }}
                  />
                </Form.Item>

                <Form.Item label={<Text style={{ color: '#ffe81f', fontWeight: 'bold' }}>Год рождения</Text>} name="birth_year">
                  <Input 
                    size="large"
                    style={{
                      background: '#222',
                      border: '1px solid #333',
                      color: '#fff',
                      borderRadius: '4px'
                    }}
                  />
                </Form.Item>

                <Space style={{ justifyContent: 'center', width: '100%', marginTop: '24px' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    style={{
                      background: '#ffe81f',
                      borderColor: '#ffe81f',
                      color: '#000',
                      fontWeight: 'bold',
                      borderRadius: '4px'
                    }}
                  >
                    СОХРАНИТЬ
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    icon={<CloseOutlined />}
                    style={{
                      background: '#333',
                      borderColor: '#666',
                      color: '#ffe81f',
                      fontWeight: 'bold',
                      borderRadius: '4px'
                    }}
                  >
                    ОТМЕНА
                  </Button>
                </Space>
              </Form>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'start', 
                  marginBottom: '32px',
                  borderBottom: '2px solid #333',
                  paddingBottom: '20px'
                }}>
                  <Title 
                    level={1} 
                    style={{ 
                      margin: 0, 
                      color: '#ffe81f',
                      fontFamily: "'Star Jedi', sans-serif",
                      textTransform: 'uppercase'
                    }}
                  >
                    {currentCharacter.name}
                  </Title>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => setEditMode(true)}
                    style={{
                      background: '#ffe81f',
                      borderColor: '#ffe81f',
                      color: '#000',
                      fontWeight: 'bold',
                      borderRadius: '4px'
                    }}
                  >
                    РЕДАКТИРОВАТЬ
                  </Button>
                </div>

                <Divider style={{ borderColor: '#333', margin: '24px 0' }} />

                <Row gutter={[32, 24]}>
                  <Col span={12}>
                    <Text strong style={{ color: '#ffe81f', fontSize: '16px' }}>РОСТ:</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: '18px' }}>{currentCharacter.height}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ color: '#ffe81f', fontSize: '16px' }}>ВЕС:</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: '18px' }}>{currentCharacter.mass}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ color: '#ffe81f', fontSize: '16px' }}>ГОД РОЖДЕНИЯ:</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: '18px' }}>{currentCharacter.birth_year}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ color: '#ffe81f', fontSize: '16px' }}>ПОЛ:</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: '18px' }}>{currentCharacter.gender}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ color: '#ffe81f', fontSize: '16px' }}>ЦВЕТ ГЛАЗ:</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: '18px' }}>{currentCharacter.eye_color}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ color: '#ffe81f', fontSize: '16px' }}>ЦВЕТ ВОЛОС:</Text>
                    <br />
                    <Text style={{ color: '#fff', fontSize: '18px' }}>{currentCharacter.hair_color}</Text>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Space>
      </div>
    </div>
  )
}