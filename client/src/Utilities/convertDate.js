export const convertDate = date => {
    const convDate = new Date(date)
    const newDate = convDate.toLocaleString()
    return newDate
}
