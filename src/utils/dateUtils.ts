import dayjs from 'dayjs'

/**
 * Formats a date to the storage format: "December 10, 2025 at 11:59:09 PM UTC+5:30"
 */
export const formatDateForStorage = (date: Date | dayjs.Dayjs): string => {
  const d = dayjs(date)
  return d.format('MMMM D, YYYY [at] h:mm:ss A UTCZ')
}

/**
 * Parses a date from the storage format and returns a Date object
 */
export const parseDateFromStorage = (dateString: string): Date => {
  // Handle the format "December 10, 2025 at 11:59:09 PM UTC+5:30"
  try {
    // Remove the "at" and parse with dayjs
    const cleanDate = dateString.replace(' at ', ' ')
    return dayjs(cleanDate).toDate()
  } catch {
    return new Date(dateString) // fallback
  }
}

/**
 * Formats a date for display in tables (shorter format)
 * Handles various date formats including Firebase timestamps and ISO strings
 */
export const formatDateForDisplay = (dateString: string): string => {
  try {
    // If the string is empty or null, return invalid
    if (!dateString) {
      return 'Invalid Date'
    }
    
    let date: Date
    
    // Try parsing as ISO date first (most common for Firebase)
    if (dateString.includes('T') && dateString.includes('Z')) {
      date = new Date(dateString)
    } 
    // Try parsing as timestamp (number)
    else if (!isNaN(Number(dateString))) {
      date = new Date(Number(dateString))
    }
    // Try parsing the custom storage format
    else if (dateString.includes(' at ')) {
      date = parseDateFromStorage(dateString)
    }
    // Fallback to regular Date parsing
    else {
      date = new Date(dateString)
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Formats a date for display with more detail
 */
export const formatDateForDetailedDisplay = (dateString: string): string => {
  try {
    const date = parseDateFromStorage(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  } catch {
    return 'Invalid Date'
  }
}
