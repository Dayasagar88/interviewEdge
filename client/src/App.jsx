import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth'

export const ServerUrl = "http://localhost:8000"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/auth" element={<Auth/>} />


    </Routes>
  )
}

export default App
