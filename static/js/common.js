var container = $('.container')

var offlineItems = $('.girls__item--offline')
var girls = $('.girls')
var girlsItem = $('.girls__item')
var girlsItemShit = $('.girls__item--shit')
var girlsPhoto = $('.girls__photo')
var girlsGroups = $('.girls__groups')
var girlsShowShit = $('.girls__show-shit')

var view = $('.view')
var viewNumber = $('.view__number')
var viewColumnFour = $('.view__column--four')
var viewColumnEight = $('.view__column--eight')
var viewOnline = $('.view__online')
var viewShit = $('.view__shit')

var findCountGirls = () => {
  var count = 0

  girlsItem.each((i, item) => {
    if ($(item).css('display') !== 'none') count++
  })

  viewNumber.html(count)
}

var changeColumns = (link, columns) => {
  if (!link.hasClass('active')) {
    // Деактивируем одну ссылку
    (link == viewColumnFour) ? viewColumnEight.removeClass('active') : viewColumnFour.removeClass('active')

    var itemWidth = container.innerWidth() / columns

    container.css('columnCount', columns)

    girlsItem.each((i, item) => $(item).css('width', `${itemWidth}px`))

    link.addClass('active')
  } else {
    container.css('columnCount', 6)

    girlsItem.each((i, item) => $(item).css('width', 'auto'))

    link.removeClass('active')
  }
}

$(viewColumnFour).on('click', () => {
  changeColumns(viewColumnFour, 4)
})

$(viewColumnEight).on('click', () => {
  changeColumns(viewColumnEight, 8)
})

$(viewOnline).on('click', () => {
  if (!viewOnline.hasClass('active')) {
    offlineItems.each((i, item) => $(item).css('display', 'none'))
    viewOnline.addClass('active')
  } else {
    offlineItems.each((i, item) => $(item).css('display', 'block'))
    viewOnline.removeClass('active')
  }

  findCountGirls()
})

$(viewShit).on('click', () => {
  if (!viewShit.hasClass('active')) {
    girlsItemShit.each((i, item) => $(item).css('display', 'none'))
    viewShit.addClass('active')
  } else {
    girlsItemShit.each((i, item) => $(item).css('display', 'block'))
    viewShit.removeClass('active')
  }

  findCountGirls()
})

$(girlsGroups).on('click', event => {
  var target = event.target

  if (target.className !== 'girls__show-shit') return

  var item = target.parentNode
  var link = item.childNodes[3]
  var list = item.childNodes[5]

  $(link).css('display', 'block')
  $(list).css('display', 'block')

  $(link).on('click', () => {
    $(link).css('display', 'none')
    $(list).css('display', 'none')
  })
})

var nw = url => {
  var options = 'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=200,height=200,left=500,top=500'
  var wind = window.open(url, 'message', options)

  setTimeout(() => wind.close(), 750)
}

findCountGirls()
