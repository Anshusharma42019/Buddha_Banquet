import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaPhone, FaStickyNote, FaRegCalendarAlt } from 'react-icons/fa'
import { bookingAPI } from '../../services/api'
import DashboardLoader from '../../DashboardLoader'

function Calendar() {
  const [pageLoading, setPageLoading] = useState(true)
  const [bookings, setBookings] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [hoveredDate, setHoveredDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  )
  const calendarRef = useRef(null)
  const navigate = useNavigate()
  
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const userRole = localStorage.getItem("role") || "Staff"

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setHoveredDate(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [month, year])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await bookingAPI.getAll()
      const grouped = {}
      response.data.forEach((booking) => {
        if (booking.startDate) {
          const dateKey = booking.startDate.split('T')[0]
          if (!grouped[dateKey]) grouped[dateKey] = []
          grouped[dateKey].push(booking)
        }
      })
      setBookings(grouped)
      console.log('Calendar bookings:', response.data)
    } catch (err) {
      console.error('Failed to fetch bookings for calendar:', err)
    } finally {
      setLoading(false)
    }
  }

  const format = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const getAuspiciousDates = (year) => {
    const format = (m, d) =>
      `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return [
      format(1, 16), format(1, 17), format(1, 18), format(1, 19), format(1, 21),
      format(1, 22), format(1, 24), format(1, 25), format(1, 30), format(2, 3),
      format(2, 4), format(2, 6), format(2, 7), format(2, 13), format(2, 14),
      format(2, 15), format(2, 18), format(2, 19), format(2, 20), format(2, 21),
      format(2, 25), format(3, 1), format(3, 2), format(3, 3), format(3, 5),
      format(3, 6), format(4, 14), format(4, 16), format(4, 17), format(4, 18),
      format(4, 19), format(4, 20), format(4, 21), format(4, 22), format(4, 23),
      format(4, 25), format(4, 29), format(4, 30), format(5, 1), format(5, 5),
      format(5, 6), format(5, 7), format(5, 8), format(5, 10), format(5, 15),
      format(5, 17), format(5, 18), format(5, 19), format(5, 24), format(5, 28),
      format(6, 2), format(6, 4), format(6, 7), format(6, 8), format(7, 11),
      format(7, 12), format(7, 13), format(7, 17), format(7, 20), format(7, 21),
      format(7, 22), format(7, 26), format(7, 28), format(7, 29), format(7, 31),
      format(8, 1), format(8, 3), format(8, 4), format(8, 7), format(8, 8),
      format(8, 9), format(8, 13), format(8, 14), format(8, 17), format(8, 24),
      format(8, 25), format(8, 28), format(8, 29), format(8, 30), format(8, 31),
      format(9, 1), format(9, 2), format(9, 3), format(9, 4), format(9, 5),
      format(9, 26), format(9, 27), format(9, 28), format(10, 1), format(10, 2),
      format(10, 3), format(10, 4), format(10, 7), format(10, 8), format(10, 10),
      format(10, 11), format(10, 12), format(10, 22), format(10, 23), format(10, 24),
      format(10, 25), format(10, 26), format(10, 27), format(10, 28), format(10, 29),
      format(10, 30), format(10, 31), format(11, 2), format(11, 3), format(11, 4),
      format(11, 7), format(11, 8), format(11, 12), format(11, 13), format(11, 22),
      format(11, 23), format(11, 24), format(11, 25), format(11, 26), format(11, 27),
      format(11, 29), format(11, 30), format(12, 4), format(12, 5), format(12, 6)
    ]
  }

  const auspiciousDates = new Set(getAuspiciousDates(year))

  const getDateCategory = (date) => {
    const heavyDates = new Set(
      Array.from(auspiciousDates).filter((d) =>
        [1, 5, 10, 15, 20, 25, 30].includes(parseInt(d.split("-")[2]))
      )
    )
    const mediumDates = new Set(
      Array.from(auspiciousDates).filter((d) =>
        [2, 4, 7, 9, 17, 22, 27].includes(parseInt(d.split("-")[2]))
      )
    )
    if (heavyDates.has(date)) return "heavy"
    if (mediumDates.has(date)) return "medium"
    if (auspiciousDates.has(date)) return "light"
    return null
  }

  const getTooltipText = (category) => {
    if (category === "heavy") return "Heavy Booking"
    if (category === "medium") return "Medium Booking"
    if (category === "light") return "Light Booking"
    return ""
  }

  const dateTemplate = ({ year, month, day }) => {
    const currentDate = format(year, month, day)
    const dayBookings = bookings[currentDate] || []
    const bookingCount = dayBookings.length
    
    // Determine fill position based on booking time
    let fillPosition = 'none'
    
    if (bookingCount === 1) {
      const booking = dayBookings[0]
      const timeValue = booking.startTime || booking.timeSlot || booking.time || booking.slot
      if (timeValue) {
        const startHour = parseInt(timeValue.split(':')[0])
        fillPosition = startHour < 16 ? 'upper' : 'lower'
      } else {
        fillPosition = 'upper'
      }
    } else if (bookingCount >= 2) {
      fillPosition = 'full'
    }
    
    const isSelected = selectedDate === currentDate
    const highlightClass = isSelected
      ? "border-4 shadow-lg scale-105 ring-2"
      : "border border-gray-200"
    
    return (
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 relative rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden ${
          isSelected 
            ? 'bg-[#c3ad6b] text-white shadow-lg scale-105 border-2 border-[#c3ad6b]' 
            : 'bg-white hover:bg-[#c3ad6b]/10 border border-gray-200 hover:border-[#c3ad6b]/30'
        }`}
        onClick={() => setSelectedDate(currentDate)}
        onMouseEnter={() => setHoveredDate(currentDate)}
        onMouseLeave={() => setHoveredDate(null)}
        title={bookingCount > 0 ? `${bookingCount} booking${bookingCount > 1 ? 's' : ''}` : ''}
      >
        {/* Fill based on booking time */}
        {fillPosition === 'upper' && !isSelected && (
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#c3ad6b]/40 rounded-t-lg"></div>
        )}
        {fillPosition === 'lower' && !isSelected && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#c3ad6b]/40 rounded-b-lg"></div>
        )}
        {fillPosition === 'full' && !isSelected && (
          <div className="absolute inset-0 bg-[#c3ad6b]/40 rounded-lg"></div>
        )}
        
        {/* Day number */}
        <span className={`font-bold text-xs sm:text-sm z-10 ${
          isSelected ? 'text-white' : 'text-gray-800'
        }`}>
          {day}
        </span>
        
        {/* Booking count indicator */}
        {bookingCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
            {bookingCount}
          </div>
        )}
      </div>
    )
  }

  const renderCalendar = () => {
    const weeks = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    let day = 1
    
    for (let week = 0; week < 6; week++) {
      const days = []
      for (let i = 0; i < 7; i++) {
        const cellIndex = week * 7 + i
        if (cellIndex < firstDay || day > daysInMonth) {
          days.push(
            <td key={i} className="h-16 sm:h-20 align-top text-center"></td>
          )
        } else {
          const cellContent = dateTemplate({ year, month, day })
          days.push(
            <td key={i} className="h-16 sm:h-20 p-1">
              <div className="h-full flex items-center justify-center">
                {cellContent}
              </div>
            </td>
          )
          day++
        }
      }
      const isRowEmpty = days.every(
        (cell) =>
          !cell.props.children || cell.props.children.props === undefined
      )
      if (!isRowEmpty) {
        weeks.push(<tr key={week}>{days}</tr>)
      }
    }
    return weeks
  }

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNext = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const bookingsForDate = bookings[selectedDate] || []

  if (pageLoading) {
    return <DashboardLoader pageName="Calendar" />
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'hsl(45, 100%, 95%)'}}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color: 'hsl(45, 100%, 20%)'}}>
            Event Calendar
          </h1>
          {isMobile && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c3ad6b]/10 text-[#c3ad6b] font-semibold text-sm shadow">
              {userRole === "Admin" ? "👑 Admin" : "👤 Staff"}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <button
                onClick={handlePrev}
                className="w-full sm:w-auto px-6 py-3 bg-[#c3ad6b] hover:bg-[#b39b5a] text-white rounded-lg shadow font-semibold transition-colors"
              >
                ← Previous
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-center" style={{color: 'hsl(45, 100%, 20%)'}}>
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-3 bg-[#c3ad6b] hover:bg-[#b39b5a] text-white rounded-lg shadow font-semibold transition-colors"
              >
                Next →
              </button>
            </div>

            {/* Calendar */}
            <div className="overflow-x-auto bg-[#c3ad6b]/10 rounded-xl p-4">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <th key={day} className="h-12 text-sm md:text-base font-bold text-[#c3ad6b] border-b-2 border-[#c3ad6b]/20">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderCalendar()}</tbody>
              </table>
            </div>

            {/* Add Booking Button */}
            <div className="mt-6 text-center">
              <Link
                to="/add-booking"
                state={{ selectedDate }}
              >
                <button
                  className={`py-3 px-8 rounded-lg font-semibold shadow transition-colors ${
                    selectedDate
                      ? "bg-[#c3ad6b] hover:bg-[#b39b5a] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!selectedDate}
                >
                  Add Booking {selectedDate && `for ${selectedDate}`}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Booking list for selected date */}
        {selectedDate && (
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4" style={{color: 'hsl(45, 100%, 20%)'}}>
                  Bookings for {selectedDate}
                </h3>
                {bookingsForDate.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg">
                      No bookings for this date
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookingsForDate.map((b, i) => (
                      <div
                        key={i}
                        className="bg-[#c3ad6b]/10 border border-[#c3ad6b]/20 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="font-bold text-gray-800 mb-2">{b.name}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>📞 {b.phone || b.number || b.contact}</div>
                          <div>📋 {b.bookingStatus}</div>
                          {(b.startTime || b.time) && (
                            <div>⏰ {b.startTime || b.time}</div>
                          )}
                          {b.notes && (
                            <div>📝 {b.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Calendar