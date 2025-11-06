import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchExpenses, fetchStats } from '../store/slices/expenseSlice'
import { format } from 'date-fns'
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import RupeeIcon from '../components/RupeeIcon'

function Dashboard() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { expenses, stats, loading } = useSelector((state) => state.expenses)

  useEffect(() => {
    dispatch(fetchExpenses({ limit: 5 }))
    dispatch(fetchStats())
  }, [dispatch])

  if (loading && !expenses.length) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.welcome')}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="mt-2 text-gray-600">{t('dashboard.title')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">
                {t('dashboard.thisMonth')}
              </p>
              <p className="text-4xl font-bold mt-2">
                ₹{stats?.currentMonth?.total?.toFixed(2) || '0.00'}
              </p>
              <p className="text-primary-100 mt-2">
                {t('dashboard.totalExpenses')}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <RupeeIcon className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                {t('dashboard.thisMonth')}
              </p>
              <p className="text-4xl font-bold mt-2">
                {stats?.currentMonth?.count || 0}
              </p>
              <p className="text-purple-100 mt-2">
                {t('dashboard.expenseCount')}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <FiShoppingBag className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {t('dashboard.recentExpenses')}
          </h2>
          <Link
            to="/expenses"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {t('dashboard.viewAll')}
            <FiArrowRight />
          </Link>
        </div>

        {expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {expense.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t(`categories.${expense.category}`)} •{' '}
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900 ml-4">
                  ₹{expense.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <RupeeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {t('dashboard.noExpenses')}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {t('dashboard.addFirst')}
            </p>
            <Link
              to="/expenses"
              className="mt-6 inline-flex btn btn-primary"
            >
              {t('expenses.addNew')}
            </Link>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {stats?.byCategory && stats.byCategory.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('statistics.byCategory')}
          </h2>
          <div className="space-y-4">
            {stats.byCategory.slice(0, 5).map((item) => (
              <div key={item._id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t(`categories.${item._id}`)}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{item.total.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (item.total / stats.currentMonth.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

