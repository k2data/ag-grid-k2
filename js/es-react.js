;
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  (global.agTable = factory());
})(this, function () {
	var agGrids
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		agGrids = require('ag-grid');
		require('../css/ag-grid-k2.css');
	} else {
		agGrids = agGrid
	}
	function agTable(opts) {
		if (typeof opts === 'object') {
			var columnDefs = [];
			var gridOptions;
			var tabH = opts.tableHeader;
			var EventUtil = { // 绑定event的通用函数
					addHandler: function (element, type, handler) {
						if (element.addEventListener) {
							element.addEventListener(type, handler, false);
						} else if (element.attachEvent) {
							element.attachEvent('on' + type, handler);
						} else {
							element['on' + type] = handler;
						}
					},

					removeHandler: function (element, type, handler) {
						if (element.removeEventListener) {
							element.removeEventListener(type, handler, false);
						} else if (element.detachEvent) {
							element.detachEvent('on' + type, handler);
						} else {
							element['on' + type] = null;
						}
					}
				};


			for (var i = 0, len = tabH.length; i < len; i++) {
				var columnJson = {};
				columnJson.headerName = tabH[i].headerName;
				columnJson.field = tabH[i].field;
				columnJson.width = tabH[i].width;
				columnJson.suppressSizeToFit = tabH[i].fixed;
				columnJson.cellStyle = tabH[i].style;
				columnJson.cellRenderer = tabH[i].render;
				columnJson.minWidth = tabH[i].minWidth;
				columnJson.maxWidth = tabH[i].maxWidth;

				if ('filter' in tabH[i]) {
					if (tabH[i].filter === 'k2FilterSearch' || tabH[i].filter === 'k2FilterType') {
						tabH[i].filter === 'k2FilterSearch' ?
						columnJson.filter = ContainerFilterText:
						columnJson.filter = DataTypeFilter;
					} else if (tabH[i].filter){
						if (tabH[i].filter !== true) {
							columnJson.filter = tabH[i].filter;
						}
					} else {
						columnJson.suppressMenu = true;
					}
				}

				// judge sorting model
				if ('sorting' in tabH[i]) {
					if (tabH[i].sorting === false) {
						columnJson.suppressSorting = true;
					}
				}
				columnDefs.push(columnJson);
			}

			//是否开启列ID显示模式
			if ('tableColumId' in opts) {
				if (typeof opts.tableColumId === 'string') {
					var columnId = {
						headerName: "序号",
						field: "",
						width: 45,
						suppressSizeToFit: true,
						suppressSorting: true,
						suppressMenu: true,
						cellRenderer: function (params) {
							return params.node.id + 1
						},
						cellStyle:{'text-align':'center'},
						suppressSizeToFit: true
					}
					if (opts.tableColumId !== '') {
						columnId.headerName = opts.tableColumId;
					}
					columnDefs.unshift(columnId);
				} else {
					console.error('tableColumId:请确保为字符串！！');
					return;
				}
			}

			//判断是否开启tableCheckBox模式
			if (opts.tableCheckBox && opts.tableCheckBox === true) {
				// columnDefs[0].checkboxSelection = true;
				var columnCheckBox = {
					headerName: "<input type='checkbox' name='allCheckBox' id='allCheckBox'/>",
					field: "",
					width: 35,
					suppressSizeToFit: true,
					suppressSorting: true,
					suppressMenu: true,
					checkboxSelection: true,
					cellStyle:{'text-align': 'center'}
				};
				columnDefs.unshift(columnCheckBox);
				// console.log(columnDefs);
			}

		} else {
			console.error('配置文件为json格式数据！！');
			return;
		}

			// 自定义的过滤器
			function ContainerFilterText () {
	    }

	    ContainerFilterText.prototype.init = function (params) {
	      this.valueGetter = params.valueGetter;
	      this.filterText = null;
	      this.setupGui(params);
	    }

	    // not called by ag-Grid, just for us to help setup
	    ContainerFilterText.prototype.setupGui = function (params) {
	      this.gui = document.createElement('div');
	      this.gui.innerHTML =
	          '<div style="width: auto;">' +
	            '<div style="background-color:#e0e1e2;padding-left:8px;font-size:12px;line-height:20px;' +
	            'border-bottom:1px solid #A9A9A9">查询</div>' +
	            '<div style="margin:15px 8px;white-space:nowrap">' +
	              '<input class="ag-grid-filter-input" type="text" id="filterText" placeholder="搜索..."/>' +
	              '<button class="ag-grid-filter-btn" id="filterTextSubmit">' +
	               ' <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">' +
										 '<g>' +
										  '<rect fill="#fff" id="canvas_background" height="14" width="14" y="-1" x="-1" style="opacity:0"/>' +
										 ' <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">' +
										  ' <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>' +
										 ' </g>' +
										' </g>' +
										 '<g>' +
										  '<ellipse stroke="#000" ry="3.5935" rx="3.5935" id="svg_6" cy="5.03132" cx="5.03132" fill-opacity="null" stroke-opacity="null" stroke-width="2" fill="none"/>' +
										  '<line stroke-linecap="null" stroke-linejoin="null" id="svg_7" y2="10.74967" x2="10.68717" y1="7.99986" x1="7.99986" fill-opacity="null" stroke-opacity="null" stroke-width="2" stroke="#000" fill="none"/>' +
										 '</g>' +
									'</svg>' +
	              '</button>' +
	            '<div>' +
	          '</div>';

	      var that = this;
	      this.filterText = this.gui.querySelector('#filterText');
	      this.eFilterText = this.gui.querySelector('#filterText');
	      this.eFilterTextSubmit = this.gui.querySelector('#filterTextSubmit');
	      this.eFilterTextSubmit.addEventListener('click', function () {
	        that.filterId = params.colDef.field;
	        console.log(params.colDef.field);
	        params.filterChangedCallback();
	      });
	      this.gui.addEventListener('keydown', function (event) {
	        if (event.keyCode === 13) {
	          that.filterId = params.colDef.field;
	          console.log(params.colDef.field);
	          params.filterChangedCallback();
	        }
	      });
	    }

	    ContainerFilterText.prototype.getGui = function () {
	      return this.gui;
	    }

	    ContainerFilterText.prototype.doesFilterPass = function (params) {
	        // make sure each word passes separately, ie search for firstname, lastname
	      var passed = true;
	      var valueGetter = this.valueGetter;
	      this.filterText.value.toLowerCase().split(' ').forEach(function (filterWord) {
	        var value = valueGetter(params);
	        if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
	          passed = false;
	        }
	      })

	      return passed;
	    }

	    ContainerFilterText.prototype.isFilterActive = function () {
	      return this.filterText.value !== null && this.filterText.value !== undefined && this.filterText.value !== '';
	    }

	    ContainerFilterText.prototype.getApi = function () {
	      var that = this;
	      return {
	        getModel: function () {
	          var model = {value: that.filterText.value, id: that.filterId};
	          return model;
	        },
	        setModel: function (model) {
	          that.eFilterText.value = model.value;
	          that.filterId = model.value;
	        }
	      }
	    }

	    // DataTypeFilter为数据类型过滤器
	    function DataTypeFilter () {
	    }
	    DataTypeFilter.prototype.init = function (params) {
	      this.eGui = document.createElement('div');
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
	       '</div>';
	      this.dataDouble = this.eGui.querySelector('#dataDouble');
	      this.dataBoolean = this.eGui.querySelector('#dataBoolean');
	      this.dataDouble.addEventListener('change', this.onRbChanged.bind(this));
	      this.dataBoolean.addEventListener('change', this.onRbChanged.bind(this));
	      this.filterId = params.colDef.field;
	      this.filterChangedCallback = params.filterChangedCallback;
	      // console.log(params)
	      // this.filterActive = false
	      this.valueGetter = params.valueGetter;
	    }

	    DataTypeFilter.prototype.onRbChanged = function () {
	      if (this.dataDouble.checked === true && this.dataBoolean.checked === true) {
	        this.filterActive = false;
	      } else {
	        this.filterActive = true;
	      }
	      this.filterChangedCallback();
	    }

	    DataTypeFilter.prototype.getGui = function (params) {
	      return this.eGui;
	    }

	    DataTypeFilter.prototype.doesFilterPass = function () {
	      // return this.dataDouble.checked !== false && this.dataBoolean.checked !== false
	    }

	    DataTypeFilter.prototype.isFilterActive = function () {
	      return this.filterActive;
	    }

	    DataTypeFilter.prototype.getApi = function () {
	      var that = this;
	      return {
	        getModel: function () {
	          // var model = {value: that.dataBoolean.value, id: that.filterId}
	          var model = [];
	          if (that.dataBoolean.checked === true) {
	            model.push({value: that.dataBoolean.value, id: that.filterId});
	          }
	          if (that.dataDouble.checked === true) {
	            model.push({value: that.dataDouble.value, id: that.filterId});
	          }
	          return model;
	        },
	        setModel: function (model) {
	        }
	      }
	    }

	    // 自定义tags列的渲染样式
	    function MyTagsRender () {}
	    MyTagsRender.prototype.init = function (params) {
	      let tagsArr = [];
	      params.data.tags
	        ? tagsArr = params.data.tags.split(';')
	        : tagsArr = [];
	      const addHandler = function (element, type, handler) {
	        if (element.addEventListener) {
	          element.addEventListener(type, handler);
	        } else if (element.attachEvent) {
	          element.attachEvent('on' + type, handler);
	        } else {
	          element['on' + type] = handler;
	        }
	      }
	      const removeHandler = function (element, type, handler) {
	        if (element.removeEventListener) {
	          element.removeEventListener(type, handler);
	        } else if (element.detachEvent) {
	          element.detachEvent('on' + type, handler);
	        } else {
	          element['on' + type] = null;
	        }
	      }
	      this.eGui = document.createElement('ul')
	      for (let i = 0; i < tagsArr.length; i++) {
	        const node = document.createElement('li');
	        const textNode = document.createTextNode(tagsArr[i]);
	        node.classList.add('tag-detail');
	        node.appendChild(textNode);
	        this.eGui.appendChild(node);
	        if (prop.tags.length !== 0) {
	          // console.log(prop.tags[0].value)
	          prop.tags[0].value.indexOf(tagsArr[i]) !== -1
	          ? node.classList.add('selected-tag')
	          : node.classList.add('normal-tag');
	        }
	      }
	      // 使用事件委托机制
	      const that = this
	      const tagClickEvent = function (event) { // 标签单击事件
	        let val, arr1;
	        const arr2 = [];
	        if (event.target.className.indexOf('active') === -1) {
	          if (params.api.tagsText.tags) {
	            if (params.api.tagsText.tags.indexOf(event.target.innerHTML) === -1) {
	              event.target.className = event.target.className + ' ' + 'active';
	              val = params.api.tagsText.tags + ',' + event.target.innerHTML;
	            } else {
	              val = params.api.tagsText.tags;
	            }
	          } else {
	            event.target.className = event.target.className + ' ' + 'active';
	            val = event.target.innerHTML;
	          }
	        } else {
	          event.target.className = 'tag-detail';
	          arr1 = params.api.tagsText.tags.split(',');
	          for (let i = 0, len = arr1.length; i < len; i++) {
	            if (arr1[i] !== event.target.innerHTML) {
	              arr2.push(arr1[i]);
	            }
	          }
	          val = arr2.join(',');
	        }

	        prop.setUnCommittedTag({
	          key: 'tags',
	          value: val
	        })
	        // console.log(params.api.tagsText)
	      }
	      addHandler(window, 'keydown', function (event) {
	        if (event.keyCode === 17) {
	          addHandler(that.eGui, 'click', tagClickEvent);// 当ctrl按下添加标签单击事件
	        }
	      })

	      addHandler(window, 'keyup', function (event) {
	        if (event.keyCode === 17) {
	          removeHandler(that.eGui, 'click', tagClickEvent); // 当ctrl按起移除标签单击事件
	        }
	      })
	    }
	    MyTagsRender.prototype.getGui = function () {
	      return this.eGui;
	    }


		// mine icon
		var nextIcon = '<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" class="page-svg-icon">' +
							 '<g>' +
							  '<rect fill="#fff" id="canvas_background" height="14" width="14" y="-1" x="-1" style="opacity:0"/>' +
							 ' <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">' +
							   '<rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>' +
							  '</g>' +
							 '</g>' +
							 '<g>' +
							  '<line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="10.78092" x2="3.56267" y1="5.65627" x1="8.8123" stroke-width="1.5" stroke="#000" fill="none"/>' +
							  '<line transform="rotate(90.17411041259766 6.24998140335083,4.031386375427245) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_3" y2="6.59371" x2="3.62516" y1="1.46906" x1="8.8748" stroke-width="1.5" stroke="#000" fill="none"/>' +
							 '</g>' +
							'</svg>';
		var lastIcon = '<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" class="page-svg-icon">' +
						 '<g>' +
						 ' <rect fill="#fff" id="canvas_background" height="14" width="14" y="-1" x="-1" style="opacity:0"/>' +
						  '<g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">' +
						   '<rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>' +
						  '</g>' +
						 '</g>' +
						 '<g>' +
						 ' <line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="10.78092" x2="1.56281" y1="5.65627" x1="6.81244" stroke-width="1.5" stroke="#000" fill="none"/>' +
						  '<line transform="rotate(90.17411041259766 4.250119209289551,4.03138542175293) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_3" y2="6.59371" x2="1.6253" y1="1.46906" x1="6.87494" stroke-width="1.5" stroke="#000" fill="none"/>' +
						  '<line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" y2="10.78092" x2="5.37504" y1="5.65627" x1="10.62468" stroke-width="1.5" stroke="#000" fill="none"/>' +
						  '<line transform="rotate(90.17411041259766 8.062356948852539,4.031385421752929) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_5" y2="6.59371" x2="5.43754" y1="1.46906" x1="10.68717" stroke-width="1.5" stroke="#000" fill="none"/>' +
						 '</g>' +
						'</svg>';
		var firstIcon = '<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" class="page-svg-icon">' +
						 '<g>' +
						  '<rect fill="#fff" id="canvas_background" height="14" width="14" y="-1" x="-1" style="opacity:0"/>' +
						  '<g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">' +
						   '<rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>' +
						 ' </g>' +
						' </g>' +
						 '<g>' +
						  '<line transform="rotate(90 4.125129222869872,8.218595504760744) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="10.78092" x2="1.50031" y1="5.65627" x1="6.74995" stroke-width="1.5" stroke="#000" fill="none"/>' +
						  '<line transform="rotate(180 4.187624454498291,4.03138542175293) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_3" y2="6.59371" x2="1.56281" y1="1.46906" x1="6.81244" stroke-width="1.5" stroke="#000" fill="none"/>' +
						  '<line transform="rotate(90 7.937364578247069,8.218595504760744) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" y2="10.78092" x2="5.31255" y1="5.65627" x1="10.56218" stroke-width="1.5" stroke="#000" fill="none"/>' +
						  '<line transform="rotate(180 7.999861240386963,4.031385421752931) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_5" y2="6.59371" x2="5.37504" y1="1.46906" x1="10.62468" stroke-width="1.5" stroke="#000" fill="none"/>' +
						 '</g>' +
						'</svg>';
		var previousIcon = '<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" class="page-svg-icon">' +
							 '<g>' +
							  '<rect fill="#fff" id="canvas_background" height="14" width="14" y="-1" x="-1" style="opacity:0"/>' +
							  '<g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">' +
							  ' <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>' +
							  '</g>' +
							 '</g>' +
							 '<g>' +
							  '<line transform="rotate(90 5.81251049041748,8.218595504760744) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" y2="10.78092" x2="3.18769" y1="5.65627" x1="8.43733" stroke-width="1.5" stroke="#000" fill="none"/>' +
							  '<line transform="rotate(180 5.875005722045898,4.03138542175293) " stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_5" y2="6.59371" x2="3.25019" y1="1.46906" x1="8.49983" stroke-width="1.5" stroke="#000" fill="none"/>' +
							 '</g>' +
							'</svg>';
		var secDownIcon = '<svg width="12px" height="12px" version="1.1" xmlns="http://www.w3.org/2000/svg"' +
	      'fill="#656D78" class="page-svg-icon"><path d="M1 4 L 6 10 L 11 4 Z"/>' +
	      '</svg>'
	    var secUpIcon = '<svg width="12px" height="12px" version="1.1" xmlns="http://www.w3.org/2000/svg"' +
	      'fill="#656D78" class="page-svg-icon"><path d="M1 9 L 6 3 L 11 9 Z"/></svg>'

		gridOptions = {
		  columnDefs: columnDefs,
			rowHeight:34,
			headerHeight:28,
		  // rowData: opts.tableData // temporarily display
		  localeText: {
	        page: '',
	        more: '...',
	        to: '',
	        of: '/',
	        next: nextIcon,
	        last: lastIcon,
	        first: firstIcon,
	        previous: previousIcon,
	        loadingOoo: '数据加载中...',
	        noRowsToShow: '暂无数据'
	      },
	      icons: {
	        sortAscending: secUpIcon,
	        sortDescending: secDownIcon
	      }
		};

		// set table type (set gridOptions attributes)

		if (opts.tablePaging) {

			gridOptions.rowModelType = 'pagination'; // set paging model
		}

		if (opts.tableFilter) {
			gridOptions.enableFilter = true;
		}

		if (opts.tableSort) {
			gridOptions.enableSorting = true;
		}

		if (opts.tableRowSelectionChanged) {
			if (typeof opts.tableRowSelectionChanged === 'function') {
				gridOptions.onSelectionChanged = function () {
					opts.tableRowSelectionChanged(gridOptions)
				}
			} else {
				console.error('tableRowSelectionChanged: 请设置value为执行函数！！');
			}
		}
		// 改变没也显示多少条数的下拉框插件
		function addPageNumBox () {
			if (opts.tablePageNum) {

				if (typeof opts.tablePageNum && opts.tablePageNum instanceof Array) {

					var pageNumDiv = document.createElement('div');
					var south = document.querySelector('#south').childNodes[0].childNodes[0];
					var pageNumTemp, pageNumArr, selectNum, selectedNum;

					selectedNum = opts.tablePageNum[0];
					pageNumArr = opts.tablePageNum.sort();
					pageNumTemp = '<div class="ag-page-size">' +
													'<select id="pageNumChange">' +
											    '</select>' +
													'<label class="select-arrow" for="onChangeVal" id="forChangeBox">' +
													'<svg width="22px" height="20px" version="1.1" fill="#656D78">' +
													'<path d="M7 8 L 10 13 L 13 8 Z"></path></svg>' +
													'</label>' +
												'</div>'+
										    '&nbsp;条/页' +
										    '&nbsp;&nbsp;&nbsp;共<span id="pageNumChangeTotal"></span>条';
					pageNumDiv.innerHTML = pageNumTemp;
					pageNumDiv.style.margin = '5px 0 0 0';
					pageNumDiv.style.lineHeight = '20px';
					pageNumDiv.style.color = '#666';
					selectNum = pageNumDiv.getElementsByTagName('select')[0];

					// set pagenum change box
					for (var i = 0, len = pageNumArr.length; i < len; i++) {
						var optionItem = document.createElement('option');
						 	optionItem.value = pageNumArr[i];
						 	optionItem.innerHTML = pageNumArr[i];
						if (parseInt(optionItem.value) === selectedNum) {
							optionItem.setAttribute('selected', 'selected');
						}
						selectNum.appendChild(optionItem);
					}

					south.firstChild.style.display = 'none';
					south.appendChild(pageNumDiv);
					onPageSizeChanged();
				} else {
					console.error("tablePageNum:please input data must be array!!")
					return;
				}
			}
		}

		// 表格顶部的页数显示和翻页控制功能
		function addTopNum () {
			if (opts.tableTopNum) {
				var topPageNum = document.createElement('div');
				// var borderLayout_eRootPanel = document.querySelector('#borderLayout_eRootPanel');
				var borderLayout_eRootPanel = opts.targetDiv.childNodes[0];
				var topPageNumBtn, topNumBtnPre, topNumBtnNext, btNext, btPrevious, current, k2CurrentNum, btFirst, btLast;
				var reg = /^\+?[1-9][0-9]*$/;

				topPageNum.style.width = '100%';
				topPageNum.style.height = '30px';
				topPageNumBtn = '<div id="k2TopNum" style="height:100%;width:auto;color:#666">' +
									'<button id="topNumBtnPre" class="ag-paging-button">'+previousIcon+'</button>' +
										'<span id="k2CurrentNum">1</span>/<span id="k2TotalNum">...</span>' +
									'<button id="topNumBtnNext" class="ag-paging-button">'+nextIcon+'</button>' +
								'</div>';
				topPageNum.innerHTML = topPageNumBtn;

				switch (opts.tableTopNum) {
					case 'left':
						opts.targetDiv.insertBefore(topPageNum, borderLayout_eRootPanel);
						document.querySelector('#k2TopNum').style.float = 'left';
						break;
					case 'right':
						opts.targetDiv.insertBefore(topPageNum, borderLayout_eRootPanel);
						document.querySelector('#k2TopNum').style.float = 'right';
						break;
					case 'middle':
						document.querySelector('#k2TopNum').style.margin = '0px auto';
						break;
					default:
						console.error('tableTopNum: please input "left" or "right" or "middle"!!');
						return;
				}

				topNumBtnPre = document.querySelector('#topNumBtnPre');
				topNumBtnNext = document.querySelector('#topNumBtnNext');
				btPrevious = document.querySelector('#btPrevious');
				btNext = document.querySelector('#btNext');
				k2CurrentNum = document.querySelector('#k2CurrentNum');
				current = document.querySelector('#current');
				btFirst = document.querySelector('#btFirst');
				btLast = document.querySelector('#btLast');

				EventUtil.addHandler(topNumBtnPre, 'click', function () {
					btPrevious.click();
					k2CurrentNum.innerHTML = current.value;
				});

				EventUtil.addHandler(topNumBtnNext, 'click', function () {
					btNext.click();
					k2CurrentNum.innerHTML = current.value;
				});

				EventUtil.addHandler(btPrevious, 'click', function () {
					k2CurrentNum.innerHTML = current.value;
				});

				EventUtil.addHandler(btNext, 'click', function () {
					k2CurrentNum.innerHTML = current.value;
				});

				EventUtil.addHandler(btFirst, 'click', function () {
					k2CurrentNum.innerHTML = current.value;
				});

				EventUtil.addHandler(btLast, 'click', function () {
					k2CurrentNum.innerHTML = current.value;
				});

				EventUtil.addHandler(current, 'keyup', function (event) {
			      if (reg.test(event.target.value)) {
					k2CurrentNum.innerHTML = current.value;
			      } else {
			        return;
			      }
				});

				EventUtil.addHandler(current, 'blur', function (event) {
					console.log(event.target.value)
					if (event.target.value === '') {
				        event.target.value = k2CurrentNum.innerHTML;
				      }
				});

			}


		}

		// 获取数据时的显示
		var ajaxState, allOfTheData;
		var pageSize;
		// 判断tablePageNum是否存在，和后期的处理
		if (opts.tablePageNum) {
			if (opts.tablePageNum instanceof Array) {
				if (typeof opts.tablePageNum[0] === 'number') {
					pageSize = opts.tablePageNum[0]
				} else {
					console.error('tablePageNum warning:请确保数组的子项全部为数字！！');
					return;
				}
			} else {
				console.error('tablePageNum:请设置为数组');
				return;
			}
		} else {
			pageSize = 50;
		}
		//判断数据是本地test数据还是远程URl数据
		switch (typeof opts.tableData) {
			case 'object':
				// if (opts.tableData instanceof Array) {
				// 	if (opts.tablePaging) {
				// 		// console.log(gridOptions);
				// 		// console.log(opts.tableData instanceof Array);
				// 		// setRowData(opts.tableData);
				// 		setTimeout(function(){
				// 			addTabRowClick();//行单击事件
				// 			allSelectModel();// 行全选事件
				// 			addPageNumBox(); //是否添加页数控制器
				// 			addTopNum(); // 是否添加顶部页码控制
				// 			sizeToFit();
				// 			setRowData(opts.tableData);
				// 		}, 500)
				//
				// 	} else {
				// 		gridOptions.rowData = opts.tableData;
				// 		setTimeout(function () {
				// 			sizeToFit();
				// 			allSelectModel();// 行全选事件
				// 		}, 500);
				// 	}
				// 	ajaxState = false;
				// } else {
				// 	ajaxState = true;
				// }
				// console.log('loacl');

				// opts.tableData.local?
				// console.log(opts.tableData) :
				// (
				// console.error('tableData:please input correct!!')
				// )
				if (opts.tableData.local) {
					if (typeof opts.tableData.local === 'boolean') { //判断local字段是否是布尔类型
						// 当为本地数据时，判断数据格式是否正确(不能是远程数据的格式)
						if (opts.tableData.data instanceof Array) {
							for (let i = 0, len = opts.tableData.data.length; i < len; i++) {
								if (typeof opts.tableData.data[i] !== 'object') {
									console.error('tableData.data: please input correct data!');
									return;
								}
							}

							if (opts.tablePaging) {
								setTimeout(function(){
									addTabRowClick();//行单击事件
									allSelectModel();// 行全选事件
									addPageNumBox(); //是否添加页数控制器
									addTopNum(); // 是否添加顶部页码控制
									sizeToFit();
									setRowData(opts.tableData.data);
								}, 500)

							} else {
								gridOptions.rowData = opts.tableData.data;
								setTimeout(function () {
									sizeToFit();
									allSelectModel();// 行全选事件
								}, 500);
							}
							ajaxState = false;
						} else {
							console.error('tableData.data: must be array!!');
							return;
						}
					} else {
						console.error('tableData.local: please input boolean type!!');
						return;
					}
				} else {
					if (opts.tableData.data instanceof Array) {
						ajaxState = true;
					} else {
						console.error('tableData.data: must be array!!');
						return;
					}
				}
				break;
			case 'string':
				gridOptions.rowData = null;
				ajaxState = true;
				break;
			default:
				console.error("please input correct data");
				ajaxState = false;
				return;
		}
		// 判断表格行选择模式
		if (opts.tableRowSelect) {
			switch (opts.tableRowSelect) {
				case 'one':
					gridOptions.rowSelection = 'single';
					break;
				case 'more':
					gridOptions.rowSelection = 'multiple';
					break;
				default:
					console.error('tableRowSelect:请设置value为’one’或‘more’！！');
					return;
			}
		}

		//判断是否开启自适应模式
		if (opts.tableResize) {
			gridOptions.enableColResize = true;
		}

		// 全选或反选的功能
		function allSelectModel () {
			if (opts.tableCheckBox && opts.tableCheckBox === true) {
				var allCheckBox = document.querySelector('#allCheckBox');
				EventUtil.addHandler(allCheckBox, 'click', function (e) {
					if (e.target.checked === true) {
						// console.log(1); //此处可增加全选后要执行的函数。。。。。后期根据需求增加要执行的函数
						gridOptions.api.selectAll(true);
					} else {
						// console.log(2);//此处可增加全选后要执行的函数。。。。。
						gridOptions.api.deselectAll(true);
					}
				});
			}
		}

		// 判断单击事件
		function addTabRowClick () {
			if (opts.tableRowClick) {
				gridOptions.api.addEventListener('rowClicked', function (params) {
					opts.tableRowClick(arguments[0])
				});
			}
		}

		// 调整每页显示条数时触发
		function onPageSizeChanged() {
		 	var pageNumChange = document.querySelector('#pageNumChange');
		 	EventUtil.addHandler(pageNumChange, 'change', function (e) {
			    pageSize = new Number(this.value);
			    createNewDatasource();
					if (!opts.tableData.local) {
						ajaxPaging(opts.tableData.data[2]);
					}
		 	});
		}
		// 自适应事件
		function sizeToFit() {
			if (opts.tableResize) {
				gridOptions.api.addEventListener('modelUpdated', function () {
					gridOptions.api.sizeColumnsToFit();
				});
				EventUtil.addHandler(window, 'resize', function () {
					gridOptions.api.sizeColumnsToFit();
				})
			}
			// 自适应以后开启sizeColumnsToFit API属性,将此写于此处防止数据加载时间太长，导致首次加载不能自适应的bug
		}
		// 分页模式下使用, 创建数据源
		function createNewDatasource() {
		    if (!allOfTheData) {
		        return;
		    }

		    var dataSource = {
		        pageSize: pageSize, // 设置每页显示条数
		        getRows: function (params) {
		        		var k2TotalNum, total, pageNumChangeTotal;
		            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
								console.log('my test');
                var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                var lastRow = -1;

                lastRow = allOfTheData.length;
                params.successCallback(rowsThisPage, lastRow);
                k2TotalNum = document.querySelector('#k2TotalNum');
                pageNumChangeTotal = document.querySelector('#pageNumChangeTotal');
                total = document.querySelector('#total').innerHTML;
                if (k2TotalNum) {
                	k2TotalNum.innerHTML = total ;
                }
								if (pageNumChangeTotal) {
									pageNumChangeTotal.innerHTML = total;
								}
		        }
		    };
				// console.log(gridOptions)
		    gridOptions.api.setDatasource(dataSource);
		}


		// 介于不是全部加载所有数据，针对url进行分页的情况
		function ajaxPaging(url) {
		    if (!url) {
		        return;
		    }

		    var dataSource = {
		        pageSize: pageSize, // 设置每页显示条数
		        getRows: function (params) {
		        		var k2TotalNum, total, totalNum, pageNumChangeTotal, allOfTheData, splitO;
		            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
								url.indexOf('?') === -1 ? splitO = '?' : splitO = ''
								let URL = url + splitO + ''+opts.tableData.data[0]+'='+pageSize+'' + '&' + ''+opts.tableData.data[1]+'=' + params.endRow / pageSize;
								console.log(URL);

								fetch (URL)
								.then (function (response) {
							    if (response.status !== 200) {
							      console.log('存在问题，状态码:' + response.status)
							      biu('服务器异常！', {type: 'danger', timeout: 10000})
							      return
							    }
							    return response.json()
							  })
								.then (function (data) {
									if (data == null) {
							      return;
							    }
									allOfTheData = opts.tableData.data[3](data).data;
									total = opts.tableData.data[3](data).total;
								})
								.then (function () {
									if (!allOfTheData) {
										return;
									}
									var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
									var lastRow = -1;

									// lastRow = allOfTheData.length;
									lastRow = total;
									params.successCallback(rowsThisPage, lastRow);
									document.querySelector('#k2CurrentNum').innerHTML = document.querySelector('#current').value;
									k2TotalNum = document.querySelector('#k2TotalNum');
									pageNumChangeTotal = document.querySelector('#pageNumChangeTotal');
									totalNum = document.querySelector('#total').innerHTML;
									if (k2TotalNum) {
										k2TotalNum.innerHTML = totalNum ;
									}
									if (pageNumChangeTotal) {
										pageNumChangeTotal.innerHTML = totalNum;
									}
								})
								.catch (function (err) {
									console.error('Fetch Err:' + err);
									params.failCallback(err);
								})
		        }
		    };
		    gridOptions.api.setDatasource(dataSource);
		}

		function setRowData(rowData) {
		    allOfTheData = rowData;
		    createNewDatasource();
		}


		// 后台远程获取数据全部都加载的情况，让ag-grid自己进行分页
		function ajaxData(url) {
		  // if ajax data
		  var httpRequest = new XMLHttpRequest();
			  httpRequest.open('GET', url);
			  httpRequest.send();
			  httpRequest.onreadystatechange = function() {
	             if (httpRequest.readyState == 4 && httpRequest.status == 200) {
		             var httpResponse = JSON.parse(httpRequest.responseText);
		            //  console.log(httpResponse);
		              if (opts.tablePaging) {
										addTabRowClick();//行单击事件
										allSelectModel();// 行全选事件
										addPageNumBox(); //是否添加页数控制器
										addTopNum(); // 是否添加顶部页码控制
		              	setRowData(httpResponse); //分页模式
		              } else {
		              	gridOptions.api.setRowData(httpResponse); // 非分页模式
										addTabRowClick();//行单击事件
										allSelectModel();// 行全选事件
										sizeToFit();
		              }
	            }
		      };
		  // if ()
		  // ajaxPaging(url);
		};

		// window.addEventListener("resize", function(){
		  	new agGrids.Grid(opts.targetDiv, gridOptions);// 创建表格
			if (ajaxState) {
				sizeToFit();
				if (typeof opts.tableData === 'string') {
					ajaxData(opts.tableData);
				} else if (typeof opts.tableData === 'object') {
					if(opts.tableData.data) {

						if (opts.tableData.data.length === 4) {
							// 判断数据格式的正确性（防止在远程数据出现本地数据的格式)
							for (let i = 0, len = opts.tableData.data.length; i < len; i++) {
								if (typeof opts.tableData.data[i] === 'object' || typeof opts.tableData.data[3] !== 'function') {
									console.error('tableData.data: please input correct data!!');
									return;
								}
							}
							if (opts.tablePaging) {
								addTabRowClick();//行单击事件
								allSelectModel();// 行全选事件
								addPageNumBox(); //是否添加页数控制器
								addTopNum(); // 是否添加顶部页码控制
								ajaxPaging(opts.tableData.data[2]);
							} else {
								console.error('warning: 在此tableData的情况下，必须设置分页模式，'
								 + '若不想设置分页模式，则直接将tableData设置成URL即可'
								);
							}

						} else {
							console.error('tableData.data: please input correct data type!!');
							return;
						}
					} else {
						ajaxData(opts.tableData.url);
					}
				}
			}

		// });
	}
	// var GrApi = gridOptions;
	agTable.agGrid = agGrids;
	// console.log(agTable.agGrid);
	return agTable;
})
;
