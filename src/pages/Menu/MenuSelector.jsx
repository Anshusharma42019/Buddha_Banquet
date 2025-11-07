import { useState } from 'react'

const MenuSelector = ({ onSave, initialItems = [], onClose, foodType, ratePlan }) => {
  const [selectedItems, setSelectedItems] = useState(initialItems)

  const menuCategories = {
    'Starters': ['Paneer Tikka', 'Veg Seekh Kebab', 'Spring Rolls'],
    'Main Course': ['Dal Makhani', 'Paneer Butter Masala', 'Veg Biryani'],
    'Desserts': ['Gulab Jamun', 'Ice Cream', 'Kheer']
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Select Menu Items</h3>
        <p className="text-gray-600">Food Type: {foodType} | Plan: {ratePlan}</p>
      </div>

      {Object.entries(menuCategories).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h4 className="font-medium text-gray-800">{category}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {items.map(item => (
              <label key={item} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleItemToggle(item)}
                  className="rounded border-gray-300 text-[#c3ad6b] focus:ring-[#c3ad6b]"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#c3ad6b] text-white rounded-lg hover:bg-[#b39b5a]"
        >
          Save Selection ({selectedItems.length} items)
        </button>
      </div>
    </div>
  )
}

export default MenuSelector