import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { authAPI } from '../services/api'
import { FiGlobe } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import RupeeIcon from '../components/RupeeIcon'

function Login() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }

    // Handle auth callback
    const authStatus = searchParams.get('auth')
    const error = searchParams.get('error')

    if (authStatus === 'success') {
      toast.success(t('auth.welcome'))
    } else if (error) {
      toast.error(t('errors.generic'))
    }
  }, [isAuthenticated, navigate, searchParams, t])

  const handleGoogleLogin = () => {
    authAPI.loginWithGoogle()
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
        >
          <FiGlobe className="h-5 w-5" />
          <span className="font-medium">{i18n.language.toUpperCase()}</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <RupeeIcon className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold text-white">
            {t('app.title')}
          </h1>
          <p className="mt-2 text-lg text-primary-100">
            {t('auth.loginDescription')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                {t('auth.welcome')}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {t('app.description')}
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <FcGoogle className="h-6 w-6" />
              {t('auth.loginWithGoogle')}
            </button>

            <div className="text-center">
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ✨ Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center justify-center gap-2">
                    <span>📊</span> Track all your expenses
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span>📈</span> View detailed statistics
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span>🌍</span> Multi-language support
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span>🔒</span> Secure Google authentication
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-primary-100">
          © 2024 Expense Tracker. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login

