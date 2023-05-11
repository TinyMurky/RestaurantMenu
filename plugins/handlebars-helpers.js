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
module.exports = { checkIsHome, linkOfSort }
