// 只讓主頁會顯示創造餐廳
function checkIsHome (title) {
  return title === '我的餐廳'
}

function checkIsLogin (title) {
  return title === '登入我的餐廳'
}

function checkIsRegister (title) {
  return title === '註冊我的餐廳'
}
// create sort <a href> url
function linkOfSort (keyword, sortRule) {
  if (keyword) {
    return `/search?keyword=${keyword}&sort=${sortRule}`
  } else {
    return `/?sort=${sortRule}`
  }
}

// More operator for {{#if}}
function ifCond (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return v1 == v2 ? options.fn(this) : options.inverse(this)
    case '===':
      return v1 === v2 ? options.fn(this) : options.inverse(this)
    case '!=':
      return v1 != v2 ? options.fn(this) : options.inverse(this)
    case '!==':
      return v1 !== v2 ? options.fn(this) : options.inverse(this)
    case '<':
      return v1 < v2 ? options.fn(this) : options.inverse(this)
    case '<=':
      return v1 <= v2 ? options.fn(this) : options.inverse(this)
    case '>':
      return v1 > v2 ? options.fn(this) : options.inverse(this)
    case '>=':
      return v1 >= v2 ? options.fn(this) : options.inverse(this)
    case '&&':
      return v1 && v2 ? options.fn(this) : options.inverse(this)
    case '||':
      return v1 || v2 ? options.fn(this) : options.inverse(this)
    default:
      return options.inverse(this)
  }
}
module.exports = { checkIsHome, checkIsLogin, checkIsRegister, linkOfSort, ifCond }
