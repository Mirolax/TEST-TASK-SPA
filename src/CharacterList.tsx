import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './redux.ts'
import type { Character } from './types'
import {  Pagination,  Input,  Card,  Row,  Col,  Typography, Space, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { fetchCharacters, setCurrentPage, setSearch } from '../src/store/slices/charactersSlice.ts'

const { Title, Text } = Typography
const { Meta } = Card

export default function CharacterList() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { list, currentPage, total, search, loading } = useAppSelector(state => state.characters)

  useEffect(() => {
    dispatch(fetchCharacters({ page: currentPage, search }))
  }, [dispatch, currentPage, search])

  const handlePageChange = (page:number) => {
    dispatch(setCurrentPage(page))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    dispatch(setSearch(value))
    dispatch(setCurrentPage(1))
  }

  const handleCharacterClick = (character: Character) => {
    const id = character.url.split('/').filter(Boolean).pop()
    navigate(`/character/${id}`, { state: { character } })
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={1}>Тестовое задание </Title>
            <Text type="secondary">Total: {list.length} characters</Text>
          </div>

          <Input
            size="large"
            placeholder="Search characters..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
            style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {list.map((person:Character) => (
                <Col xs={24} sm={12} md={8} lg={6} key={person.url}>
                  <Card hoverable onClick={() => handleCharacterClick(person)} style={{ height: '100%' }}>
                    <Meta
                      title={person.name}
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text>Height: {person.height}</Text>
                          <Text>Mass: {person.mass}</Text>
                          <Text>Birth: {person.birth_year}</Text>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={10}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </Space>
      </div>
    </div>
  )
}