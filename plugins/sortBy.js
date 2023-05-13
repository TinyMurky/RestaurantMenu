function sortBy(setting, sortQuery) {
  //mapping dropdown sort query to object that passed into sort()
  // args:
  //  setting: the config object ot pass into res.render()
  //  sortQuery: the sorting keyword provide by <a href> of sort function
  setting.index.sortKeyword = sortQuery ? sortQuery.trim() : null
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
