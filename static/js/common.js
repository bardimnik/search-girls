var container = document.querySelector(".container");

var girlsItem = document.querySelectorAll(".girls__item");
var girlsPhoto = document.querySelectorAll(".girls__photo");

var viewWidth = document.querySelector(".view__width");
var viewColumnFour = document.querySelector(".view__column--four");
var viewColumnEight = document.querySelector(".view__column--eight");

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
      columnGap: "10px"
    });

    for (var block in girlsItem) {
      girlsItem[block].style.width = `${itemWidth}px`;
    }
  } else {
    Object.assign(container.style, {
      columnCount: 6,
      columnGap: "5px"
    });

    for (var block in girlsItem) {
      girlsItem[block].style.width = "auto";
    }
  }
};

viewWidth.addEventListener("click", () => {
  if (viewWidth.checked) {
    Object.assign(container.style, {
      maxWidth: "1170px",
      width: "100%"
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
      maxWidth: "none",
      columnGap: "5px"
    });

    for (var block in girlsItem) {
      girlsItem[block].style.width = "auto";
    }
  }
});

viewColumnFour.addEventListener("click", () => {
  changeColumns(viewColumnFour, 4, 2);
});

viewColumnEight.addEventListener("click", () => {
  changeColumns(viewColumnEight, 8, 2);
});

var nw = e => {
  var h = 500;
  var w = 500;

  var wndw = window.open(e, "", "scrollbars=1,height=" + Math.min(h, screen.availHeight) + ", width=" + Math.min(w, screen.availWidth) + ",left=" + Math.max(0, (screen.availWidth - w) / 2) + ",top=" + Math.max(0, (screen.availHeight - h) / 2));

  setTimeout(function() {
    wndw.close();
  }, 500);
}
