import './App.css'
import FlatList from './FlatList'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<FlatList />} />
      </Routes>
    </Router>
  )
}

export default App
