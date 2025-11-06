import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './Layout'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default ProtectedRoute

