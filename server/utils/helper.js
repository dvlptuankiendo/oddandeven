export const getLocalBeginTodayTimestamp = () => {
    const today = new Date()
    const startOfDayUTC = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfDayUTCString = startOfDayUTC.toLocaleString()
    const localStartOfDay = new Date(startOfDayUTCString)
    const localStartOfDayTimeStamp = localStartOfDay.getTime()

    return localStartOfDayTimeStamp
}