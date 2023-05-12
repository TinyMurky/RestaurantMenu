//只讓主頁會顯示創造餐廳
function checkIsHome(title) {
  return title === "我的餐廳"
}

function linkOfSort(keyword, sortRule) {
  if (keyword) {
    return `/search?keyword=${keyword}&sort=${sortRule}`
  } else {
    return `/?sort=${sortRule}`
  }
}
function ifCond(v1, operator, v2, options) {
  //for more if logic
  switch (operator) {
  case "==":
    return v1 == v2 ? options.fn(this) : options.inverse(this)
  case "===":
    return v1 === v2 ? options.fn(this) : options.inverse(this)
  case "!=":
    return v1 != v2 ? options.fn(this) : options.inverse(this)
  case "!==":
    return v1 !== v2 ? options.fn(this) : options.inverse(this)
  case "<":
    return v1 < v2 ? options.fn(this) : options.inverse(this)
  case "<=":
    return v1 <= v2 ? options.fn(this) : options.inverse(this)
  case ">":
    return v1 > v2 ? options.fn(this) : options.inverse(this)
  case ">=":
    return v1 >= v2 ? options.fn(this) : options.inverse(this)
  case "&&":
    return v1 && v2 ? options.fn(this) : options.inverse(this)
  case "||":
    return v1 || v2 ? options.fn(this) : options.inverse(this)
  default:
    return options.inverse(this)
  }
}
module.exports = { checkIsHome, linkOfSort, ifCond }
