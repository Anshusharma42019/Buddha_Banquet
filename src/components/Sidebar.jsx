import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCalendarAlt, FaList, FaUtensils, FaCalendarCheck, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import RegaliaLogo from "../assets/Regalia.png"

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    {
      title: 'Calendar',
      icon: FaCalendarAlt,
      path: '/calendar'
    },
    {
      title: 'Booking List',
      icon: FaList,
      path: '/banquet/list-booking'
    },
    {
      title: 'Menu Plan',
      icon: FaUtensils,
      path: '/menu-plan'
    },
    {
      title: 'Lagan Calendar',
      icon: FaCalendarCheck,
      path: '/lagan-calendar'
    }
  ]

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex flex-col items-center">
          <div className="w-49 h-49 text-2xl">
            <img src={RegaliaLogo} alt="Regalia Logo" className="w-full h-full object-contain" />
          </div>
          {/* <h1 className="text-xl font-bold text-yellow-400">ASHOKA</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wider">HOTEL</p>
          <p className="text-xs text-gray-500 mt-1">SAPAN SINCE COMFORT</p> */}
        </div>
      </div>

      {/* Admin Section */}
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-[#c3ad6b] font-semibold text-lg">ADMIN</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-[#c3ad6b] text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 text-[#c3ad6b]" />
                <span className="font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar