function clickInput(input) {
	input.select();
	showTip(input);
}

function hideTip(input) {
	var select_node = input.nextSibling;
	if (select_node != undefined)
	{
		input.value = select_node.options[select_node.selectedIndex].value;
	}
	
	var filter_div_node = document.getElementById("extension_filter_div");
	if (filter_div_node)
		filter_div_node.parentNode.removeChild(filter_div_node);
}

/**
 *   显示提示信息
 *   inputId:输入input框的id值
 */
function showTip(input) {
	var inputId = input.id;
	var _inputNode = document.getElementById(inputId),
		_inputValue = _inputNode.value,
		_parentNode = _inputNode.parentNode,
		_divNode = document.createElement("div");

	var totalOptions = _inputNode.nextSibling.getElementsByTagName("option");
	var totalValues = new Array(totalOptions);
	for (var loopIdx = 0; loopIdx < totalOptions.length; ++loopIdx) {
		totalValues[loopIdx] = totalOptions[loopIdx].value.replace(/\ +/g, "").replace(/[\r\n]/g, "");
	}

	//如果已经存在了divNode 则删除
	var filter_div_node = document.getElementById("extension_filter_div");
	if (filter_div_node)
		filter_div_node.parentNode.removeChild(filter_div_node);

	//如果没有输入值的时候则无需显示提示框
	//if (_inputValue == '')
	//	return;

	var config = {
		
		divHeight: "270px",
		divWidth: "400px",
		divBorder: "1px solid gray",
		divBackgroundColor: '#ffffff',
		overflowY: "scroll",
		inputHeight: 20,
		top: 20
	};

	var _offsetPosition = getPosition(_inputNode);

	//显示待选div样式
	_divNode.id = "extension_filter_div";
	_divNode.style.backgroundColor = config.divBackgroundColor;
	_divNode.style.height = config.divHeight;
	_divNode.style.width = config.divWidth;
	_divNode.style.overflowY = config.overflowY;
	_divNode.style.display = "block";
	_divNode.style.border = config.divBorder;
	_divNode.style.position = "absolute";
	if (config.top > 0)
		_divNode.style.top = config.top;
	else
		_divNode.style.top = (_offsetPosition.y + config.inputHeight) + "px";
	_divNode.style.left = _offsetPosition.x + "px";

	_divNode.innerHTML = "";
	var _divHtml = "<div class='task' onclick=\"hideTip(" + inputId + ")\">######### 关闭 #########</div>";
	var _isExist = false; //用于判断是否存在需要提示的信息 如果是否则无需显示提示框
	for (var i = 0; i < totalValues.length; i++) {
		var _tempValue = totalValues[i];
		if (isIncluded(_tempValue, _inputValue)) {
			_isExist = true;
			_divHtml += "<div class='task' onclick=\"_inputDivClick(\'" + inputId + "\',\'" + _divNode.id + "\',\'" +
				_tempValue + "\')\">" + _tempValue + "</div>";
		}
	}
	_divNode.innerHTML = _divHtml;
	if (_isExist)
		_parentNode.appendChild(_divNode);
}

/**
 * _inputDivClick 当选中一个下拉列表选项时触发
 * inputNodeId: 输入框的id
 * divNodeId: 自动创建的div的id
 * value: 待选值
 */
function _inputDivClick(inputNodeId, divNodeId, value) {
	var inputNode = document.getElementById(inputNodeId),
		divNode = document.getElementById(divNodeId);
	inputNode.value = value;
	var options = inputNode.parentNode.getElementsByTagName("option");
	for (var loopIdx = 0; loopIdx < options.length; ++loopIdx) {
		if (options[loopIdx].value.replace(/\ +/g, "").replace(/[\r\n]/g, "") == value) {
			options[loopIdx].selected = true;
		}
	}
	inputNode.parentNode.removeChild(divNode);
}

/**
 * isInclude方法用于测试source是否包含有pattern这个字符串
 * source: 待测试的字符串
 * pattern:文本框输入的值
 */
function isIncluded(source, pattern) {
	if (pattern == "")
		return true;
	var _reg = new RegExp(".*" + pattern + ".*");
	return _reg.test(source);
}

//将要获取绝对位置的标签传进去，返回一个包含x和y属性的对象
function getPosition(e) {
	var t = e.offsetTop;
	var l = e.offsetLeft;
	while (e = e.offsetParent) {
		t += e.offsetTop;
		l += e.offsetLeft;
	}
	var point = eval("({x:" + l + ",y:" + t + "})");
	return point;
}
