import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiHome } from 'react-icons/fi'

function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          {t('errors.notFound')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('errors.generic')}
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center gap-2 btn btn-primary"
        >
          <FiHome />
          {t('common.back')}
        </Link>
      </div>
    </div>
  )
}

export default NotFound

