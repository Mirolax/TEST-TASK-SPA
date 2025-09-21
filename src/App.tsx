import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import CharacterList from './CharacterList'
import CharacterCard from './CharacterCard'
import { ConfigProvider } from 'antd'

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: '#1890ff', borderRadius: 8 } }}>
        <Router>
          <Routes>
            <Route path="/" element={<CharacterList />} />
            <Route path="/character/:id" element={<CharacterCard />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

export default App