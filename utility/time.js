const getFullTime = (time) => {
    const date = time.getDate()
    const year = time.getFullYear()
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"]
    const month = months[time.getMonth()]
    let hours = time.getHours()
    if(hours < 10) {
        hours = `0${hours}`
    }
    let minutes = time.getMinutes()
    if(minutes < 10) {
        minutes = `0${minutes}`
    }

    const fullTime = `${date} ${month} ${year} ${hours}:${minutes} WIB`

    return fullTime
}

function getDistanceTime(time) {
  let timePost = time

  let timeNow = new Date()

  let distance = timeNow - timePost

  let hours = 24
  let minutes = 60
  let seconds = 60
  let ms = 1000

  let distanceDays = distance / (ms * seconds * minutes * hours)
  let distanceHours = distance / (ms * seconds * minutes)
  let distanceMinutes = distance / (ms * seconds)
  let distanceSeconds = distance / ms

  distanceDays = Math.floor(distanceDays)
  distanceHours = Math.floor(distanceHours)
  distanceMinutes = Math.floor(distanceMinutes)
  distanceSeconds = Math.floor(distanceSeconds)

  if (distanceDays >= 1) {
      if (distanceDays > 1) {
        return distanceDays + ' days ago'
      } else {
        return distanceDays + ' day ago'
      }
  } else if (distanceHours >= 1) {
      if (distanceHours > 1) {
        return distanceHours + ' hours ago'
      } else {
        return distanceHours + ' hour ago'
      }
  } else if (distanceMinutes >= 1) {
      if (distanceMinutes > 1) {
        return distanceMinutes + ' minutes ago'
      } else {
        return distanceMinutes + ' minute ago'
      }
  } else if (distanceSeconds >= 15) {
      return distanceSeconds + ' seconds ago'
  } else {
      return 'Just now'
  }
}

module.exports = {getFullTime, getDistanceTime}