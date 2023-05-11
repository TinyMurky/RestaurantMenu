function sortBy(setting, sortQuery) {
  //mapping dropdown sort query to object pass into sort()
  setting.index.sortKeyword = sortQuery ? sortQuery.trim() : null // storing sort Keyword and pass into hidden input in search form
  switch (sortQuery) {
  case "Z->A":
    return { name: -1 }
    break
  case "類別":
    return { category: 1 }
    break
  case "地區":
    return { location: 1 }
    break
  default:
    return { name: 1 }
  }
}
module.exports = { sortBy }
