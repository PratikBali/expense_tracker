import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  setFilters,
} from '../store/slices/expenseSlice'
import { toast } from 'react-toastify'
import { FiPlus, FiFilter } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import ExpenseModal from '../components/ExpenseModal'
import ExpenseCard from '../components/ExpenseCard'

const categories = [
  'all',
  'food',
  'transportation',
  'entertainment',
  'utilities',
  'healthcare',
  'shopping',
  'education',
  'travel',
  'other',
]

function Expenses() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { expenses, loading, filters } = useSelector((state) => state.expenses)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params = {}
    if (filters.category) params.category = filters.category
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    dispatch(fetchExpenses(params))
  }, [dispatch, filters])

  const handleAddExpense = () => {
    setSelectedExpense(null)
    setModalOpen(true)
  }

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense)
    setModalOpen(true)
  }

  const handleDeleteExpense = async (expense) => {
    if (window.confirm(t('expenses.confirmDelete'))) {
      try {
        await dispatch(deleteExpense(expense._id)).unwrap()
        toast.success(t('expenses.deleteSuccess'))
      } catch (error) {
        toast.error(error)
      }
    }
  }

  const handleSubmitExpense = async (data) => {
    try {
      if (selectedExpense) {
        await dispatch(
          updateExpense({ id: selectedExpense._id, data })
        ).unwrap()
        toast.success(t('expenses.updateSuccess'))
      } else {
        await dispatch(createExpense(data)).unwrap()
        toast.success(t('expenses.addSuccess'))
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(error)
    }
  }

  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category: category === 'all' ? '' : category }))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('expenses.title')}
          </h1>
          <p className="mt-2 text-gray-600">
            {expenses.length} {t('expenses.title').toLowerCase()} • Currency: Indian Rupee (₹)
          </p>
        </div>
        <button onClick={handleAddExpense} className="btn btn-primary">
          <FiPlus className="mr-2" />
          {t('expenses.addNew')}
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-700 font-medium mb-4"
        >
          <FiFilter />
          {t('expenses.filter')}
        </button>

        {showFilters && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('expenses.category')}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      (cat === 'all' && !filters.category) ||
                      filters.category === cat
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(`categories.${cat}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expenses Grid */}
      {loading && !expenses.length ? (
        <LoadingSpinner />
      ) : expenses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">{t('expenses.noResults')}</p>
        </div>
      )}

      {/* Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitExpense}
        expense={selectedExpense}
      />
    </div>
  )
}

export default Expenses

