import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { format } from 'date-fns'

const categories = [
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

function ExpenseModal({ isOpen, onClose, onSubmit, expense = null }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: format(new Date(expense.date), 'yyyy-MM-dd'),
      })
    } else {
      setFormData({
        amount: '',
        category: 'food',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      })
    }
  }, [expense, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {expense ? t('expenses.edit') : t('expenses.addNew')}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('expenses.amount')}
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                  title="Amount in Indian Rupees (₹)"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('expenses.category')}
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('expenses.description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="input"
                  placeholder={t('expenses.description')}
                  maxLength="500"
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('expenses.date')}
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn btn-secondary"
                >
                  {t('expenses.cancel')}
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  {t('expenses.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseModal

