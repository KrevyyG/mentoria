import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './telas/Login'
import Registro from './telas/Registro'
import Tarefas from './telas/Tarefas'
import Categorias from './telas/Categorias'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Tarefas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
