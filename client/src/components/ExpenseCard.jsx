import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const categoryColors = {
  food: 'bg-orange-100 text-orange-800',
  transportation: 'bg-blue-100 text-blue-800',
  entertainment: 'bg-purple-100 text-purple-800',
  utilities: 'bg-green-100 text-green-800',
  healthcare: 'bg-red-100 text-red-800',
  shopping: 'bg-pink-100 text-pink-800',
  education: 'bg-indigo-100 text-indigo-800',
  travel: 'bg-cyan-100 text-cyan-800',
  other: 'bg-gray-100 text-gray-800',
}

function ExpenseCard({ expense, onEdit, onDelete }) {
  const { t } = useTranslation()

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`badge ${
                categoryColors[expense.category] || categoryColors.other
              }`}
            >
              {t(`categories.${expense.category}`)}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(expense.date), 'MMM dd, yyyy')}
            </span>
          </div>
          <p className="text-gray-900 font-medium mb-1 truncate">
            {expense.description}
          </p>
          <p className="text-2xl font-bold text-primary-600">
            ₹{expense.amount.toFixed(2)}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('expenses.edit')}
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('expenses.delete')}
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpenseCard

