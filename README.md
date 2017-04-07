# ag-grid-k2
针对于k2中的cosnole项目创建的一个ag-grid插件
更加方便的让大家在项目中使用ag-grid插件去创建一个表格进行展示数据

#使用方法
##js项目
js或是jq项目，可根据普通的项目使用script标签引入此插件，并且为先引入ag-grid后引入此插件
并且将此插件配套的css文件引入，
具体的ag-grid插件 大家可使用k2data中的ag-grid项目的ag-grid.js
url ： https://github.com/k2data/ag-grid.git
## react 项目
将es-react.js和ag-grid-k2.css放到项目文件夹中，
在使用的时候将其方法和样式import，即可使用

eg:
import agTable from './es-react'
import 'ag-grid-k2.css'

##具体使用方法
可参考项目中的实例。
eg:
```javascript
var targetDiv = document.querySelector("#tabBody");
var tableHeader = [
	{
		headerName: 'Make',// 必填，显示在表头的文本
		field: 'athlete', // 必填， 此项value必须为数据文件中对应的key
		filter: false,      // filter没设置或者是设置为true时，则显示默认的filter，如果设置了其他的，则显示自己定义的filter
		sorting: false,
		style: {'color': 'red'},			// 表格渲染样式设置
		render: MyTagsRender, 					// 自定义渲染的方法
		fixed: true, 	// 此属性为当自适应的时候是否固定此列的宽度（true代表固定，false或’’代表不固定），当设置固定时，宽度为当前设置的width属性值，若未设置，则默认为200，
									// 此属性在配置项中开启自适应属性设置才有效
		// minWidth: 300,		// 最小宽度，多数情况是在自适应时，设置使用
		// maxWidth: 300			// 最大宽度，多数情况是在自适应时，设置使用

	},
	{
		headerName: 'Model',
		field: 'age',
		width:200,
		filter: 'k2FilterSearch' // k2FilterSearch为此插件根据k2项目自己集合的一个filter功能,参数类型（BOOLEAN,DOUBLE），仅供参考
	},
	{
		headerName: 'Price',
		field: 'country',
		width:300,
		filter: 'k2FilterType' // k2FilterType为此插件根据k2项目自己集合的一个filer功能，仅供参考
	},
	{
		headerName: 'detail',
		field: 'country',
		width:300
	},
	{
		headerName: 'setting',
		field: 'country',
		width:300,
		filter: false
	}
];

var Url = 'js/testData.json';
function doData(data) {
	var currentData = {};
	for (let i = 0, len = data.length; i < len; i++) {
		if (data[i].country.indexOf('States') !== -1) {
			data[i].country = 'ZYDTest';
		}
	}
	currentData.data = data;
	currentData.total = data.length;
	return currentData;
}
// var sss = fetchData();
// console.log(sss);
// var tableData = {
// 	url: 'js/testData.json',
// 	showModel: 'page', // all or page 若为page的话，配置项必须设置分页模式。
// 	dataDeal:
// }

var tableData = {
	local:'', // 必须是true或是false的布尔值，true代表本地数据，false或是空代表远程数据
	data: ['size','page',Url,doData]// 此为远程数据的格式，也就是local字段为false或是空时，本地数据格式应该是数组
}

// var tableData = 'js/testData.json'
//
// var tableHeader = [
// 	{headerName: '项目名称', field: 'projectName', width: 180},
// 	{headerName: '分析类型', field: 'analysisType', width: 180},
// 	{headerName: '项目描述', field: 'description'}
// ];
//
// var tableData = {  // 本地数据显示
// 	local: true,
// 	data: [
//     {projectName: 'MyProject1', analysisType: '抽取', description: '项目描述信息'},
//     {projectName: 'MyProject2', analysisType: '预处理', description: '项目描述信息'},
//     {projectName: 'MyProject3', analysisType: '训练', description: '项目描述信息'},
//     {projectName: 'MyProject4', analysisType: '评分', description: '项目描述信息'},
//     {projectName: 'MyProject5', analysisType: '抽取', description: '项目描述信息'},
//     {projectName: 'MyProject6', analysisType: '预处理', description: '项目描述信息'},
//     {projectName: 'MyProject7', analysisType: '训练', description: '项目描述信息'},
//     {projectName: 'MyProject8', analysisType: '评分', description: '项目描述信息'},
//     {projectName: 'MyProject9', analysisType: '抽取', description: '项目描述信息'},
//     {projectName: 'MyProject30', analysisType: '预处理', description: '项目描述信息'},
//     {projectName: 'MyProject31', analysisType: '训练', description: '项目描述信息'},
//     {projectName: 'MyProject32', analysisType: '评分', description: '项目描述信息'},
//     {projectName: 'MyProject33', analysisType: '抽取', description: '项目描述信息'},
//     {projectName: 'MyProject34', analysisType: '预处理', description: '项目描述信息'},
//     {projectName: 'MyProject35', analysisType: '训练', description: '项目描述信息'}
// ]}

// var tableHeader = [
// 	{headerName: '项目ID', field: 'id'},
// 	{headerName: '项目名称', field: 'projName'},
// 	{headerName: '开发者', field: 'owner'},
// 	{headerName: '创建者', field: 'creator'},
// 	{headerName: '创建时间', field: 'createTime'},
// 	{headerName: '更新时间', field: 'updateTime'},
// 	{headerName: '项目描述', field: 'description'},
// 	{headerName: '项目信息', field: 'projectConf'}
// ];
// var tableData = 'js/data.json'
function tableRowClick (e) {
	// console.log(e);
}
var sss = '';
// 配置文件列表，请按规则填写配置项。
var configList = {
	targetDiv: targetDiv, // 必填项 ，此为表格要显示的位置
	tableHeader: tableHeader,// 必填项，表头显示文件
	tableData: tableData, // 必填项， 表格数据
	tablePaging: true, // 是否开启分页模式
	tablePageNum: [50, 10, 20], // 是否底部页数选择模式 , 数组第一项为默认被选中的项
	tableTopNum: 'right', // 是否顶部分页显示 'left, right, middle'
	tableFilter: true, // 是否开启表格过滤模式
	tableSort: true,  // 是否开启表格排序模式
	tableCheckBox: true, //设置表格可根据checkbox进行选择 true 为开启模式，false或是 ''或是未设置为关闭模式，只能在第一列设置
	tableColumId: 'ID', // 是否开启ID显示模式(value必须为字符串，当设置为空时，则会默认显示‘序号’，如不为空，则表头显示设置的value)
	tableRowSelect: 'more', // 行选择模式，one为单选，more为多选 ,设置为空值时不启用行选择模式
	tableRowClick:function (params) {tableRowClick(params)}, // 此项为表格行单击事件， 可自己定义单击后执行的事件
	tableResize: true, // 设置true则为开启自适应，并且所有列都不固定;设置为false或是‘’或没有此属性，则为关闭;[]中的子项为固定列的名字
	tableRowSelectionChanged: onSelectionChanged // 设置行选择后的回调函数
};

agTable(configList);// 生成表格

var grid = agTable.agGrid;// 此为agTable的agGrid属性，方便在项目中自己去调用GridApi
console.log(grid);
```

# ***后续
此为第一版，后续仍在优化，并根据实际项目进行功能的添加，大家也可一起进行更新，谢谢！！
