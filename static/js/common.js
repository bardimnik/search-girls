var container = document.querySelector('.container');
var offlineItems = document.querySelectorAll('.girls__item--offline');
var girls = document.querySelector('.girls');
var girlsItem = document.querySelectorAll('.girls__item');
var girlsItemShit = document.querySelectorAll('.girls__item--shit');
var girlsPhoto = document.querySelectorAll('.girls__photo');
var girlsGroups = document.querySelectorAll('.girls__groups');
var girlsShowShit = document.querySelectorAll('.girls__show-shit');

var viewNumber = document.querySelector('.view__number');
var viewWidth = document.querySelector('.view__width');
var viewColumnFour = document.querySelector('.view__column--four');
var viewColumnEight = document.querySelector('.view__column--eight');
var viewOnline = document.querySelector('.view__online');
var viewShit = document.querySelector('.view__shit');

var findCountGirls = () => {
  var count = 0;

  girlsItem.forEach(item => {
    if (item.style.display != 'none') count ++;
  });

  viewNumber.innerHTML = count;  
};

var changeColumns = (checkbox, columns, anotherColumns) => {
  if (checkbox.checked) {
    // Снимаем один чекбокс
    if (checkbox == viewColumnFour) {
      viewColumnEight.checked = false;
    } else if (checkbox == viewColumnEight) {
      viewColumnFour.checked = false;
    }

    var containerWidth = container.getBoundingClientRect().width;
    var itemWidth = containerWidth / columns;

    Object.assign(container.style, {
      columnCount: columns,
      columnGap: '10px'
    });

    girlsItem.forEach(block => {
      block.style.width = `${itemWidth}px`;
    });
  } else {
    Object.assign(container.style, {
      columnCount: 6,
      columnGap: '5px'
    });

    girlsItem.forEach(block => {
      block.style.width = 'auto';
    });
  }
};

$(viewWidth).on('click', () => {
  if (!viewWidth.checked) {
    Object.assign(container.style, {
      maxWidth: '1170px',
      width: '100%'
    });

    // Если количество колонок изменено, а затем что-то происходит с шириной,
    // то запрашиваем еще раз изменение колонок, чтобы перерассчитать ширину.
    if (viewColumnFour.checked) {
      changeColumns(viewColumnFour, 4, 2);
    } else if (viewColumnEight.checked) {
      changeColumns(viewColumnEight, 8, 2);
    }
  } else {
    Object.assign(container.style, {
      maxWidth: 'none',
      columnGap: '5px'
    });

    girlsItem.forEach(block => {
      block.style.width = 'auto';
    });
  }
});

$(viewColumnFour).on('click', () => {
  changeColumns(viewColumnFour, 4, 2);
});

$(viewColumnEight).on('click', () => {
  changeColumns(viewColumnEight, 8, 2);
});

$(viewOnline).on('click', () => {
  if (viewOnline.checked) {
    offlineItems.forEach(block => {
      block.style.display = 'none';
    });
  } else {
    offlineItems.forEach(block => {
      block.style.display = 'block';
    });
  }

  findCountGirls();
});

$(viewShit).on('click', () => {
  if (viewShit.checked) {
    girlsItemShit.forEach(item => {
      item.style.display = 'none';
    });
  } else {
    girlsItemShit.forEach(item => {
      item.style.display = 'block';
    });
  }

  findCountGirls();
});

$(girlsGroups).on('click', (event) => {
  var target = event.target;

  if (target.className != 'girls__show-shit') return;

  var item = target.parentNode;
  var link = item.childNodes[3];
  var list = item.childNodes[5];

  link.style.display = 'block';
  list.style.display = 'block';

  $(link).on('click', () => {
    link.style.display = 'none';
    list.style.display = 'none';
  });
});

var nw = e => {
  var h = 500;
  var w = 500;

  var wndw = window.open(e, '', 'scrollbars=1,height=' + Math.min(h, screen.availHeight) + ', width=' + Math.min(w, screen.availWidth) + ',left=' + Math.max(0, (screen.availWidth - w) / 2) + ',top=' + Math.max(0, (screen.availHeight - h) / 2));

  setTimeout(function() {
    wndw.close();
  }, 8200);
};

findCountGirls();