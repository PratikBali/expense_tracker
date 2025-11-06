import { useTranslation } from 'react-i18next'

function LoadingSpinner({ fullScreen = false }) {
  const { t } = useTranslation()

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="loader"></div>
    </div>
  )
}

export default LoadingSpinner

