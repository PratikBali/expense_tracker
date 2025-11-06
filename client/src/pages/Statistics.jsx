import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStats } from '../store/slices/expenseSlice'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import LoadingSpinner from '../components/LoadingSpinner'

const COLORS = [
  '#0ea5e9',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
  '#64748b',
]

function Statistics() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((state) => state.expenses)

  useEffect(() => {
    dispatch(fetchStats())
  }, [dispatch])

  if (loading || !stats) {
    return <LoadingSpinner fullScreen />
  }

  const categoryData = stats.byCategory?.map((item) => ({
    name: t(`categories.${item._id}`),
    value: item.total,
    count: item.count,
  })) || []

  const monthlyData = stats.monthlyTrend?.map((item) => ({
    month: item.month,
    total: item.total,
    count: item.count,
  })) || []

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('statistics.title')}
        </h1>
        <p className="mt-2 text-gray-600">{t('statistics.overview')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600">{t('statistics.total')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{stats.currentMonth?.total?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">{t('statistics.average')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹
            {stats.currentMonth?.count
              ? (stats.currentMonth.total / stats.currentMonth.count).toFixed(
                  2
                )
              : '0.00'}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">{t('statistics.highest')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{stats.byCategory?.[0]?.total?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">
            {t('dashboard.expenseCount')}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.currentMonth?.count || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Pie Chart */}
        {categoryData && categoryData.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('statistics.byCategory')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `₹${entry.value.toFixed(0)}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toFixed(2)}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Bar Chart */}
        {categoryData && categoryData.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('statistics.byCategory')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      {monthlyData && monthlyData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('statistics.monthlyTrend')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="total" fill="#0ea5e9" name={t('statistics.total')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Statistics

