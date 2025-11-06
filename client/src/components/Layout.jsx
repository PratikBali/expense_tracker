import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { FiHome, FiBarChart2, FiLogOut, FiMenu, FiX, FiGlobe } from 'react-icons/fi'
import { toast } from 'react-toastify'
import RupeeIcon from './RupeeIcon'

function Layout({ children }) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: FiHome },
    { name: t('nav.expenses'), href: '/expenses', icon: RupeeIcon },
    { name: t('nav.statistics'), href: '/statistics', icon: FiBarChart2 },
  ]

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success(t('auth.logout'))
      navigate('/login')
    } catch (error) {
      toast.error(error)
    }
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(newLang)
    toast.success(`${t('common.language')}: ${newLang.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h1 className="text-xl font-bold text-primary-600">
              {t('app.title')}
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          {/* Mobile user info and logout */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="w-full mb-2 btn btn-secondary flex items-center justify-center"
            >
              <FiGlobe className="mr-2" />
              {i18n.language.toUpperCase()}
            </button>
            <button
              onClick={() => {
                setSidebarOpen(false)
                handleLogout()
              }}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              <FiLogOut className="mr-2" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 border-r border-gray-200 bg-white">
          <div className="flex items-center px-6 py-6 border-b">
            <h1 className="text-2xl font-bold text-primary-600">
              {t('app.title')}
            </h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="w-full mb-2 btn btn-secondary flex items-center justify-center"
            >
              <FiGlobe className="mr-2" />
              {i18n.language.toUpperCase()}
            </button>
            <button
              onClick={handleLogout}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              <FiLogOut className="mr-2" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-gray-900">
            {t('app.title')}
          </h1>
          <button onClick={toggleLanguage} className="text-gray-700">
            <FiGlobe className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

