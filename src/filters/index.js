import Vue from 'vue'

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  const arr = value.split(' ')
  const capitalized_array = []
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    capitalized_array.push(capitalized)
  })
  return capitalized_array.join(' ')
})

Vue.filter('title', function (value, replacer = '_') {
  if (!value) return ''
  value = value.toString()

  const arr = value.split(replacer)
  const capitalized_array = []
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    capitalized_array.push(capitalized)
  })
  return capitalized_array.join(' ')
})

Vue.filter('truncate', function (value, limit) {
  return value.substring(0, limit)
})

Vue.filter('tailing', function (value, tail) {
  return value + tail
})

Vue.filter('time', function (value, is24HrFormat = false) {
  if (value) {
    const date = new Date(Date.parse(value))
    let hours = date.getHours()
    const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    if (!is24HrFormat) {
      const time = hours > 12 ? 'AM' : 'PM'
      hours = hours % 12 || 12
      return `${hours}:${min} ${time}`
    }
    return `${hours}:${min}`
  }
})

Vue.filter('date', function (value) {
  if (!value) return '';
  console.log(value);
  return new Date(value).toLocaleString([], {
    year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
})


Vue.filter('DATA_GRID_date', function (params) {
  const value = params.value;
  if (!value) return '';
  return new Date(value).toLocaleString([], {
    year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
})

Vue.filter('csv', function (value) {
  return value.join(', ')
})

Vue.filter('filter_tags', function (value) {
  return value.replace(/<\/?[^>]+(>|$)/g, '')
})

Vue.filter('k_formatter', function (num) {
  return num > 999 ? `${(num / 1000).toFixed(1)}k` : num
})
