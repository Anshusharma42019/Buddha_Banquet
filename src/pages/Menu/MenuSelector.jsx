import { useState, useEffect } from 'react'

const MenuSelector = ({ onSave, initialItems = [], onClose, foodType, ratePlan }) => {
  const [selectedItems, setSelectedItems] = useState(initialItems)
  const [menuCategories, setMenuCategories] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenuData()
  }, [foodType])

  const fetchMenuData = async () => {
    setLoading(true)
    try {
      const [categoriesResponse, menuItemsResponse] = await Promise.all([
        fetch('https://regalia-backend.vercel.app/api/categories/all'),
        fetch(foodType === 'All' 
          ? 'https://regalia-backend.vercel.app/api/menu-items/'
          : `https://regalia-backend.vercel.app/api/menu-items/?foodType=${foodType}`)
      ])
      
      const categoriesResult = await categoriesResponse.json()
      const menuItemsResult = await menuItemsResponse.json()
      
      const categories = categoriesResult.data || []
      const menuItems = menuItemsResult.data || []
      
      const categoryMap = {}
      categories.forEach(cat => {
        categoryMap[cat._id] = cat.cateName
      })
      
      const categorizedItems = {}
      
      menuItems.forEach(item => {
        if (item.isActive && item.category) {
          const categoryName = categoryMap[item.category] || item.category
          
          if (!categorizedItems[categoryName]) {
            categorizedItems[categoryName] = []
          }
          categorizedItems[categoryName].push(item.name)
        }
      })
      
      setMenuCategories(categorizedItems)
    } catch (error) {
      console.error('Error fetching menu data:', error)
      setMenuCategories({})
    } finally {
      setLoading(false)
    }
  }

  const handleItemToggle = (item) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const handleSave = () => {
    const categorizedMenu = {}
    Object.keys(menuCategories).forEach(category => {
      categorizedMenu[category] = menuCategories[category].filter(item => 
        selectedItems.includes(item)
      )
    })
    onSave(selectedItems, categorizedMenu)
    onClose()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c3ad6b]"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 lg:space-y-8 max-w-full">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold">Select Menu Items</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">Food Type: {foodType} | Plan: {ratePlan}</p>
      </div>

      {Object.entries(menuCategories).map(([category, items]) => (
        <div key={category} className="space-y-3 lg:space-y-4">
          <h4 className="font-medium text-gray-800 text-base sm:text-lg lg:text-xl xl:text-2xl">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-4 xl:gap-5">
            {items.map((item, index) => (
              <label key={`${category}-${item}-${index}`} className="flex items-center space-x-2 lg:space-x-3 cursor-pointer p-2 lg:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleItemToggle(item)}
                  className="rounded border-gray-300 text-[#c3ad6b] focus:ring-[#c3ad6b] flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5"
                />
                <span className="text-sm sm:text-base lg:text-lg break-words">{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-end gap-3 lg:gap-4 pt-4 lg:pt-6 border-t">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors text-sm lg:text-base"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 bg-[#c3ad6b] text-white rounded-lg hover:bg-[#b39b5a] font-medium transition-colors text-sm lg:text-base"
        >
          Save Selection ({selectedItems.length} items)
        </button>
      </div>
    </div>
  )
}

export default MenuSelector