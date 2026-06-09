import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RotaProtegida } from './auth/RotaProtegida'
import Login from './telas/Login'
import Registro from './telas/Registro'
import Tarefas from './telas/Tarefas'
import Categorias from './telas/Categorias'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <Tarefas />
              </RotaProtegida>
            }
          />
          <Route
            path="/categorias"
            element={
              <RotaProtegida>
                <Categorias />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
