import { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './redux.ts'
import type { Character } from './types'
import { Input, Card, Row, Col, Typography, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { fetchCharacters, setCurrentPage, setSearch } from '../src/store/slices/charactersSlice.ts'

const { Title, Text } = Typography
const { Meta } = Card

const getPersonWord = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) return 'персонаж'
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'персонажа'
  return 'персонажей'
}

export default function CharacterList() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { list, currentPage, total, search, loading } = useAppSelector(state => state.characters)
  
  const [searchValue, setSearchValue] = useState(search)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setSearch(value))
      dispatch(setCurrentPage(1)) 
    }, 500),
    [dispatch]
  )

  useEffect(() => {
    dispatch(fetchCharacters({ page: currentPage, search }))
  }, [dispatch, currentPage, search])

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value) 
    debouncedSearch(value)
  }

  const handleCharacterClick = (character: Character) => {
    const id = character.url.split('/').filter(Boolean).pop()!
    setSelectedCard(id)
    
    setTimeout(() => {
      navigate(`/character/${id}`, { state: { character } })
    }, 300)
  }

  const StarWarsLoader = () => (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 20px',
        background: 'radial-gradient(circle, #ffe81f 0%, #000 70%)',
        borderRadius: '50%',
        position: 'relative',
        animation: 'pulse 1.5s infinite alternate'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          background: '#000',
          borderRadius: '50%',
          border: '2px solid #ffe81f'
        }}></div>
      </div>
      <Text style={{ 
        color: '#ffe81f', 
        fontSize: '16px',
        fontFamily: "'Star Jedi', sans-serif",
        letterSpacing: '2px'
      }}>
        Loading
      </Text>
    </div>
  )

  const StarWarsPagination = () => {
    const totalPages = Math.ceil(total / 10)
    const pages = []
    
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)
    
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages)
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        background: 'transparent',
        padding: '20px'
      }}>
        <Space size="small">
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              color: currentPage === 1 ? '#666' : '#ffe81f',
              background: 'transparent',
              border: `2px solid ${currentPage === 1 ? '#666' : '#ffe81f'}`,
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = '#ffe81f'
                e.currentTarget.style.color = '#000'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#ffe81f'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            ◄
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                style={{
                  color: 1 === currentPage ? '#000' : '#ffe81f',
                  background: 1 === currentPage ? '#ffe81f' : 'transparent',
                  border: `2px solid #ffe81f`,
                  padding: '8px 12px',
                  margin: '0 2px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '40px'
                }}
                onMouseEnter={(e) => {
                  if (1 !== currentPage) {
                    e.currentTarget.style.background = '#ffe81f'
                    e.currentTarget.style.color = '#000'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (1 !== currentPage) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#ffe81f'
                  }
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                1
              </button>
              {startPage > 2 && (
                <span style={{ color: '#ffe81f', padding: '0 8px', fontWeight: 'bold' }}>...</span>
              )}
            </>
          )}

          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                color: page === currentPage ? '#000' : '#ffe81f',
                background: page === currentPage ? '#ffe81f' : 'transparent',
                border: `2px solid #ffe81f`,
                padding: '8px 12px',
                margin: '0 2px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '40px'
              }}
              onMouseEnter={(e) => {
                if (page !== currentPage) {
                  e.currentTarget.style.background = '#ffe81f'
                  e.currentTarget.style.color = '#000'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (page !== currentPage) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#ffe81f'
                }
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span style={{ color: '#ffe81f', padding: '0 8px', fontWeight: 'bold' }}>...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                style={{
                  color: totalPages === currentPage ? '#000' : '#ffe81f',
                  background: totalPages === currentPage ? '#ffe81f' : 'transparent',
                  border: `2px solid #ffe81f`,
                  padding: '8px 12px',
                  margin: '0 2px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '40px'
                }}
                onMouseEnter={(e) => {
                  if (totalPages !== currentPage) {
                    e.currentTarget.style.background = '#ffe81f'
                    e.currentTarget.style.color = '#000'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (totalPages !== currentPage) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#ffe81f'
                  }
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              color: currentPage === totalPages ? '#666' : '#ffe81f',
              background: 'transparent',
              border: `2px solid ${currentPage === totalPages ? '#666' : '#ffe81f'}`,
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = '#ffe81f'
                e.currentTarget.style.color = '#000'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#ffe81f'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            ►
          </button>
        </Space>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      padding: '24px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.7; }
            100% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes slideUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '30px' }}>
            <Title 
              level={1} 
              style={{ 
                color: '#ffe81f', 
                marginBottom: '8px',
                fontFamily: "'Star Jedi', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '3px'
              }}
            >
              Тестовой задание v2
            </Title>
            <Text style={{ color: '#ccc', fontSize: '16px' }}>
              Найдено: <span style={{ color: '#ffe81f', fontWeight: 'bold' }}>
                {loading ? '...' : total} {loading ? 'персонажей' : getPersonWord(total)}
              </span>
              {search && (
                <span style={{ color: '#ccc' }}> по запросу "{search}"</span>
              )}
            </Text>
          </div>

          <Input
            size="large"
            placeholder="Введите имя персонажа для поиска..."
            prefix={<SearchOutlined style={{ color: '#ffe81f' }} />}
            value={searchValue}
            onChange={handleSearch}
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              display: 'flex',
              background: '#111',
              border: '2px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 'bold'
            }}
          />

          {loading ? (
            <StarWarsLoader />
          ) : (
            <>
              <Row gutter={[20, 20]} style={{ animation: 'slideUp 0.6s ease-out' }}>
                {list.map((person: Character) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={person.url}>
                    <Card 
                      hoverable 
                      onClick={() => handleCharacterClick(person)}
                      style={{
                        height: '100%',
                        background: '#111',
                        border: `2px solid ${selectedCard === person.url.split('/').filter(Boolean).pop()! ? '#ffe81f' : '#333'}`,
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        animation: 'slideUp 0.5s ease-out'
                      }}
                      bodyStyle={{ 
                        padding: '16px',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #222 100%)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 232, 31, 0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <Meta
                        title={
                          <Text style={{ 
                            color: '#ffe81f', 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            display: 'block',
                            textAlign: 'center'
                          }}>
                            {person.name}
                          </Text>
                        }
                        description={
                          <Space direction="vertical" size="small" style={{ width: '100%', marginTop: '12px' }}>
                            <Text style={{ color: '#ccc' }}><strong>Рост:</strong> {person.height}</Text>
                            <Text style={{ color: '#ccc' }}><strong>Вес:</strong> {person.mass}</Text>
                            <Text style={{ color: '#ccc' }}><strong>Год рождения:</strong> {person.birth_year}</Text>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
              
              {total > 10 && <StarWarsPagination />}
            </>
          )}
        </Space>
      </div>
    </div>
  )
}