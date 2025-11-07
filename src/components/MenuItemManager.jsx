import { useState, useEffect } from 'react'
import { FaTrash } from 'react-icons/fa'

const MenuItemManager = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [customerRef, setCustomerRef] = useState('')
  const [message, setMessage] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', category: '', price: '' })
  const [newItemForm, setNewItemForm] = useState({ name: '', category: '', foodType: '' })
  const [foodTypeFilter, setFoodTypeFilter] = useState('All')
  const [categories, setCategories] = useState([])

  // Load menu items and categories on component mount
  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [])

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Unknown'
    const category = categories.find(cat => cat._id === categoryId)
    return category ? category.cateName : (categoryId.length > 10 ? 'Loading...' : categoryId)
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/categories/all')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      } else {
        // Fallback categories with mock ObjectIds
        setCategories([
          { _id: '674a1b2c3d4e5f6789012345', name: 'WELCOME DRINK' },
          { _id: '674a1b2c3d4e5f6789012346', name: 'MAIN COURSE' },
          { _id: '674a1b2c3d4e5f6789012347', name: 'DESSERTS' },
          { _id: '674a1b2c3d4e5f6789012348', name: 'BREADS' },
          { _id: '674a1b2c3d4e5f6789012349', name: 'RICE' },
          { _id: '674a1b2c3d4e5f678901234a', name: 'DAL' },
          { _id: '674a1b2c3d4e5f678901234b', name: 'VEGETABLE' },
          { _id: '674a1b2c3d4e5f678901234c', name: 'RAITA' },
          { _id: '674a1b2c3d4e5f678901234d', name: 'SALAD' },
          { _id: '674a1b2c3d4e5f678901234e', name: 'STARTER VEG' }
        ])
      }
    } catch (error) {
      // Fallback categories with mock ObjectIds
      setCategories([
        { _id: '674a1b2c3d4e5f6789012345', cateName: 'WELCOME DRINK' },
        { _id: '674a1b2c3d4e5f6789012346', cateName: 'MAIN COURSE' },
        { _id: '674a1b2c3d4e5f6789012347', cateName: 'DESSERTS' },
        { _id: '674a1b2c3d4e5f6789012348', cateName: 'BREADS' },
        { _id: '674a1b2c3d4e5f6789012349', cateName: 'RICE' },
        { _id: '674a1b2c3d4e5f678901234a', cateName: 'DAL' },
        { _id: '674a1b2c3d4e5f678901234b', cateName: 'VEGETABLE' },
        { _id: '674a1b2c3d4e5f678901234c', cateName: 'RAITA' },
        { _id: '674a1b2c3d4e5f678901234d', cateName: 'SALAD' },
        { _id: '674a1b2c3d4e5f678901234e', cateName: 'STARTER VEG' }
      ])
    }
  }

  const fetchMenuItemsByFoodType = async (foodType) => {
    setLoading(true)
    try {
      const url = foodType === 'All' 
        ? 'http://localhost:4000/api/menu-items/'
        : `http://localhost:4000/api/menu-items/foodtype/${foodType}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setMenuItems(Array.isArray(data) ? data : [])
        setMessage(`Loaded ${data.length || 0} ${foodType === 'All' ? '' : foodType} menu items`)
      } else {
        setMessage(`Server error: ${response.status}`)
      }
    } catch (error) {
      setMessage(`API unavailable: ${error.message}`)
    }
    setLoading(false)
  }

  const fetchMenuItems = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/menu-items/')
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data) // Debug log
        
        // Handle different response formats
        let items = []
        if (Array.isArray(data)) {
          items = data
        } else if (data.data && Array.isArray(data.data)) {
          items = data.data
        } else if (data.menuItems && Array.isArray(data.menuItems)) {
          items = data.menuItems
        }
        
        setMenuItems(items)
        setMessage(`Loaded ${items.length} menu items from server`)
      } else {
        setMessage(`Server error: ${response.status}. Using fallback data.`)
        setMenuItems([
          { _id: '1', name: 'Coffee', category: '674a1b2c3d4e5f6789012345', foodType: 'Both' },
          { _id: '2', name: 'Cold Coffee', category: '674a1b2c3d4e5f6789012345', foodType: 'Both' },
          { _id: '3', name: 'Fruit Punch', category: '674a1b2c3d4e5f6789012345', foodType: 'Both' }
        ])
      }
    } catch (error) {
      setMessage(`API unavailable: ${error.message}. Using fallback data.`)
      setMenuItems([
        { _id: '1', name: 'Coffee', category: '674a1b2c3d4e5f6789012345', foodType: 'Both' },
        { _id: '2', name: 'Cold Coffee', category: '674a1b2c3d4e5f6789012345', foodType: 'Both' },
        { _id: '3', name: 'Fruit Punch', category: '674a1b2c3d4e5f6789012345', foodType: 'Both' }
      ])
    }
    setLoading(false)
  }

  // API Functions
  const getMenuByBookingId = async (id) => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(`http://localhost:4000/api/menus/${id}`)
      if (response.ok) {
        const data = await response.json()
        setMenuItems(Array.isArray(data) ? data : [])
        setMessage(`Found ${data.length || 0} menu items for booking ${id}`)
      } else {
        setMessage(`Server returned ${response.status}. Using mock data.`)
        setMenuItems([
          { id: 1, name: 'Paneer Tikka', category: 'STARTERS_GROUP', price: 250 },
          { id: 2, name: 'Tea', category: 'BEVERAGES', price: 50 }
        ])
      }
    } catch (error) {
      setMessage(`Connection failed. Using mock data.`)
      setMenuItems([
        { id: 1, name: 'Paneer Tikka', category: 'STARTERS_GROUP', price: 250 },
        { id: 2, name: 'Tea', category: 'BEVERAGES', price: 50 }
      ])
    }
    setLoading(false)
  }

  const getMenuByCustomerRef = async (ref) => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(`http://localhost:4000/api/menus/all/${ref}`)
      if (response.ok) {
        const data = await response.json()
        setMenuItems(Array.isArray(data) ? data : [])
        setMessage(`Found menu for customer ${ref}`)
      } else {
        setMessage(`Server returned ${response.status}. Using mock data.`)
        setMenuItems([
          { id: 3, name: 'Tomato Soup', category: 'SOUP_VEG', price: 120 },
          { id: 4, name: 'Paneer Butter Masala', category: 'MAIN_COURSE_PANEER', price: 280 }
        ])
      }
    } catch (error) {
      setMessage(`Connection failed. Using mock data.`)
      setMenuItems([
        { id: 3, name: 'Tomato Soup', category: 'SOUP_VEG', price: 120 },
        { id: 4, name: 'Paneer Butter Masala', category: 'MAIN_COURSE_PANEER', price: 280 }
      ])
    }
    setLoading(false)
  }

  const updateMenuByCustomerRef = async (ref, categorizedMenu) => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(`http://localhost:4000/api/menus/update/${ref}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorizedMenu })
      })
      if (response.ok) {
        setMessage('Menu updated successfully!')
      } else {
        setMessage(`Update failed: Server returned ${response.status}`)
      }
    } catch (error) {
      setMessage(`Update failed: Connection error`)
    }
    setLoading(false)
  }

  const handleEdit = (id) => {
    const item = menuItems.find(item => (item._id || item.id) === id)
    setEditingItem(id)
    setEditForm({ name: item.name, category: item.category, foodType: item.foodType })
  }

  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/menu-items/${editingItem}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      if (response.ok) {
        setMenuItems(menuItems.map(item => 
          (item._id || item.id) === editingItem ? { ...item, ...editForm } : item
        ))
        setEditingItem(null)
        setMessage('Item updated successfully!')
      } else {
        setMessage('Failed to update item')
      }
    } catch (error) {
      setMenuItems(menuItems.map(item => 
        (item._id || item.id) === editingItem ? { ...item, ...editForm } : item
      ))
      setEditingItem(null)
      setMessage(`API unavailable. Item updated locally: ${error.message}`)
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditForm({ name: '', category: '', price: '' })
  }

  const addMenuItem = async () => {
    if (!newItemForm.name || !newItemForm.category || !newItemForm.foodType) {
      setMessage('Please fill all fields')
      return
    }
    
    // Prepare data in the format expected by backend
    const menuItemData = {
      name: newItemForm.name,
      category: newItemForm.category,
      foodType: newItemForm.foodType
    }
    
    try {
      const response = await fetch('http://localhost:4000/api/menu-items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuItemData)
      })
      
      if (response.ok) {
        const newItem = await response.json()
        setMenuItems([...menuItems, newItem])
        setNewItemForm({ name: '', category: '', foodType: '' })
        setMessage('Menu item added successfully!')
      } else {
        const errorData = await response.text()
        setMessage(`Failed to add menu item: ${response.status} - ${errorData}`)
      }
    } catch (error) {
      const newItem = {
        id: Date.now(),
        name: newItemForm.name,
        category: newItemForm.category,
        foodType: newItemForm.foodType
      }
      setMenuItems([...menuItems, newItem])
      setNewItemForm({ name: '', category: '', foodType: '' })
      setMessage(`API unavailable. Item added locally: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/menu-items/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setMenuItems(menuItems.filter(item => (item._id || item.id) !== id))
          setMessage('Item deleted successfully!')
        } else {
          setMessage('Failed to delete item')
        }
      } catch (error) {
        setMenuItems(menuItems.filter(item => (item._id || item.id) !== id))
        setMessage(`API unavailable. Item deleted locally: ${error.message}`)
      }
    }
  }



  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6" style={{color: 'hsl(45, 100%, 20%)'}}>Menu Item Manager</h2>
      
      {/* Add New Menu Item Section */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4" style={{color: 'hsl(45, 100%, 20%)'}}>Add New Menu Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItemForm.name}
            onChange={(e) => setNewItemForm({...newItemForm, name: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <select 
            value={newItemForm.category}
            onChange={(e) => setNewItemForm({...newItemForm, category: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.cateName}</option>
            ))}
          </select>
          <select 
            value={newItemForm.foodType}
            onChange={(e) => setNewItemForm({...newItemForm, foodType: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select Food Type</option>
            <option value="Both">Both</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
          <button 
            onClick={addMenuItem}
            className="px-6 py-3 text-white rounded-lg font-medium"
            style={{backgroundColor: 'hsl(45, 43%, 58%)'}}
          >
            + Add Item
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.includes('Error') || message.includes('failed') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      {/* Menu Items Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold" style={{color: 'hsl(45, 100%, 20%)'}}>Menu Items ({menuItems.length})</h3>
          <select 
            value={foodTypeFilter}
            onChange={(e) => {
              setFoodTypeFilter(e.target.value)
              fetchMenuItemsByFoodType(e.target.value)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="All">All Items</option>
            <option value="Veg">Veg Only</option>
            <option value="Non-Veg">Non-Veg Only</option>
            <option value="Both">Both</option>
          </select>
        </div>
        
        {loading ? (
          <p className="p-6 text-gray-600">Loading...</p>
        ) : menuItems.length === 0 ? (
          <p className="p-6 text-gray-600">No menu items found. Use the buttons above to fetch menu data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{color: 'hsl(45, 100%, 20%)'}}>Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{color: 'hsl(45, 100%, 20%)'}}>Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{color: 'hsl(45, 100%, 20%)'}}>Food Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{color: 'hsl(45, 100%, 20%)'}}>Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{color: 'hsl(45, 100%, 20%)'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-gray-50">
                    {editingItem === (item._id || item.id) ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.cateName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editForm.price}
                            onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          >
                            <option>Both</option>
                            <option>Veg</option>
                            <option>Non-Veg</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-800 mr-3 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                          {item.category && typeof item.category === 'object' ? item.category.cateName : getCategoryName(item.category)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.foodType || 'Both'}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleDelete(item._id || item.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuItemManager