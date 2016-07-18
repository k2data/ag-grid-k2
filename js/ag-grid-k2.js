//simple text search 
function ContainerFilterText () {
}

ContainerFilterText.prototype.init = function (params) {
  this.valueGetter = params.valueGetter
  this.filterText = null
  this.setupGui(params)
}

// not called by ag-Grid, just for us to help setup
ContainerFilterText.prototype.setupGui = function (params) {
  this.gui = document.createElement('div')
  this.gui.innerHTML =
      '<div style="width: auto;">' +
        '<div style="background-color:#e0e1e2;padding-left:8px;font-size:12px;line-height:20px;' +
        'border-bottom:1px solid #A9A9A9">查询</div>' +
        '<div style="margin:15px 8px;white-space:nowrap">' +
          '<input class="ag-grid-filter-input" type="text" id="filterText" placeholder="搜索..."/>' +
          '<span class="ag-grid-filter-btn" id="filterTextSubmit">' +
            '<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">' +
             '<g>' +
              '<rect fill="#fff" id="canvas_background" height="14" width="14" y="-1" x="-1" fill-opacity="0"/>' +
              '<g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">' +
               '<rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>' +
              '</g>' +
             '</g>' +
             '<g>' +
              '<ellipse stroke="#000" ry="3.91206" rx="3.91206" id="svg_1" cy="4.88388" cx="4.88388" stroke-width="1.5" fill="#fff" fill-opacity="0"/>' +
              '<ellipse stroke="#000" transform="rotate(44.82001876831055 9.432585716247559,9.499848365783693) " ry="0.0451" rx="2.10145" id="svg_2" cy="9.49985" cx="9.43259" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" fill="#fff"/>' +
             '</g>' +
            '</svg>' +
          '</span>' +
        '<div>' +
      '</div>'

  var that = this
  this.filterText = this.gui.querySelector('#filterText')
  this.eFilterText = this.gui.querySelector('#filterText')
  this.eFilterTextSubmit = this.gui.querySelector('#filterTextSubmit')
  this.eFilterTextSubmit.addEventListener('click', function () {
    that.filterId = params.colDef.field
    console.log(params.colDef.field)
    params.filterChangedCallback()
  })
  this.gui.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
      that.filterId = params.colDef.field
      console.log(params.colDef.field)
      params.filterChangedCallback()
    }
  })
}

ContainerFilterText.prototype.getGui = function () {
  return this.gui
}

ContainerFilterText.prototype.doesFilterPass = function (params) {
    // make sure each word passes separately, ie search for firstname, lastname
  var passed = true
  var valueGetter = this.valueGetter
  this.filterText.toLowerCase().split(' ').forEach(function (filterWord) {
    var value = valueGetter(params)
    if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
      passed = false
    }
  })

  return passed
}

ContainerFilterText.prototype.isFilterActive = function () {
  return this.filterText.value !== null && this.filterText.value !== undefined && this.filterText.value !== ''
}

ContainerFilterText.prototype.getApi = function () {
  var that = this
  return {
    getModel: function () {
      var model = {value: that.filterText.value, id: that.filterId}
      return model
    },
    setModel: function (model) {
      that.eFilterText.value = model.value
      that.filterId = model.value
    }
  }
}

// DataTypeFilter为数据类型过滤器
function DataTypeFilter () {
}
DataTypeFilter.prototype.init = function (params) {
  this.eGui = document.createElement('div')
  this.eGui.innerHTML =
   '<div style="display: inline-block;width:auto;font-size:12px">' +
   '<div style="padding:0px 8px;background-color:#e0e1e2;font-size:12px;line-height:20px;' +
   ' border-bottom:1px solid #A9A9A9">' +
   '根据数据类型查询' +
   '</div>' +
   '<label style="margin: 10px;display: block;">' +
   '  <input type="checkbox" name="dataFilter" checked="true" id="dataDouble" value="DOUBLE"' +
   '  style="vertical-align:bottom"/> DOUBLE' +
   '</label>' +
   '<label style="margin: 10px;display: block;">' +
   '  <input type="checkbox" name="dataFilter" id="dataBoolean" value="BOOLEAN" checked="true"' +
   '  style="vertical-align:middle"/> BOOLEAN' +
   '</label>' +
   '</div>'
  this.dataDouble = this.eGui.querySelector('#dataDouble')
  this.dataBoolean = this.eGui.querySelector('#dataBoolean')
  this.dataDouble.addEventListener('change', this.onRbChanged.bind(this))
  this.dataBoolean.addEventListener('change', this.onRbChanged.bind(this))
  this.filterId = params.colDef.field
  this.filterChangedCallback = params.filterChangedCallback
  // console.log(params)
  // this.filterActive = false
  this.valueGetter = params.valueGetter
}

DataTypeFilter.prototype.onRbChanged = function () {
  if (this.dataDouble.checked === true && this.dataBoolean.checked === true) {
    this.filterActive = false
  } else {
    this.filterActive = true
  }
  this.filterChangedCallback()
}

DataTypeFilter.prototype.getGui = function (params) {
  return this.eGui
}

DataTypeFilter.prototype.doesFilterPass = function () {
  // return this.dataDouble.checked !== false && this.dataBoolean.checked !== false
}

DataTypeFilter.prototype.isFilterActive = function () {
  return this.filterActive
}

DataTypeFilter.prototype.getApi = function () {
  var that = this
  return {
    getModel: function () {
      // var model = {value: that.dataBoolean.value, id: that.filterId}
      var model = []
      if (that.dataBoolean.checked === true) {
        model.push({value: that.dataBoolean.value, id: that.filterId})
      }
      if (that.dataDouble.checked === true) {
        model.push({value: that.dataDouble.value, id: that.filterId})
      }
      return model
    },
    setModel: function (model) {
    }
  }
}

// 自定义tags列的渲染样式
function MyTagsRender () {}
MyTagsRender.prototype.init = function (params) {
  let tagsArr = []
  params.data.tags
    ? tagsArr = params.data.tags.split(';')
    : tagsArr = []
  const addHandler = function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  }
  const removeHandler = function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler)
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  }
  this.eGui = document.createElement('ul')
  for (let i = 0; i < tagsArr.length; i++) {
    const node = document.createElement('li')
    const textNode = document.createTextNode(tagsArr[i])
    node.classList.add('tag-deta    il')
    node.appendChild(textNode)
    this.eGui.appendChild(node)
    if (prop.tags.length !== 0) {
      // console.log(prop.tags[0].value)
      prop.tags[0].value.indexOf(tagsArr[i]) !== -1
      ? node.classList.add('selected-tag')
      : node.classList.add('normal-tag')
    }
  }
  // 使用事件委托机制
  const that = this
  const tagClickEvent = function (event) { // 标签单击事件
    let val, arr1
    const arr2 = []
    if (event.target.className.indexOf('active') === -1) {
      if (params.api.tagsText.tags) {
        if (params.api.tagsText.tags.indexOf(event.target.innerHTML) === -1) {
          event.target.className = event.target.className + ' ' + 'active'
          val = params.api.tagsText.tags + ',' + event.target.innerHTML
        } else {
          val = params.api.tagsText.tags
        }
      } else {
        event.target.className = event.target.className + ' ' + 'active'
        val = event.target.innerHTML
      }
    } else {
      event.target.className = 'tag-detail'
      arr1 = params.api.tagsText.tags.split(',')
      for (let i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== event.target.innerHTML) {
          arr2.push(arr1[i])
        }
      }
      val = arr2.join(',')
    }

    prop.setUnCommittedTag({
      key: 'tags',
      value: val
    })
    // console.log(params.api.tagsText)
  }
  addHandler(window, 'keydown', function (event) {
    if (event.keyCode === 17) {
      addHandler(that.eGui, 'click', tagClickEvent) // 当ctrl按下添加标签单击事件
    }
  })

  addHandler(window, 'keyup', function (event) {
    if (event.keyCode === 17) {
      removeHandler(that.eGui, 'click', tagClickEvent) // 当ctrl按起移除标签单击事件
    }
  })
}
MyTagsRender.prototype.getGui = function () {
  return this.eGui
}

// k2 icon 
var k2secDown = '<svg width="12px" height="12px" version="1.1" xmlns="http://www.w3.org/2000/svg"' +
      'fill="#656D78"><path d="M1 4 L 6 10 L 11 4 Z"/>' +
      '</svg>';
var k2secUp = '<svg width="12px" height="12px" version="1.1" xmlns="http://www.w3.org/2000/svg"' +
  'fill="#656D78"><path d="M1 9 L 6 3 L 11 9 Z"/></svg>';

// k2 pagetion

var _Interval ;
_Interval = setInterval(function (){
  var pagePre = document.querySelector("#south").querySelector("#pageRowSummaryPanel");
  var pageBtn = document.querySelector("#south").firstChild.childNodes[0].childNodes[1];
  var btFirst = document.querySelector("#btFirst");
  var btPrevious = document.querySelector("#btPrevious");
  var btNext = document.querySelector("#btNext");
  var btLast = document.querySelector("#btLast");
  if (pagePre) {
    pagePre.style.display = "none";
    pageBtn.style.float = "right";
    clearInterval(_Interval);
  }

}, 100);

