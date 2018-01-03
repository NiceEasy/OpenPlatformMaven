/**
 * 
 */

var str = "";
document.writeln("<div id=\"_contents\" style=\"padding:6px; background-color:#E3E3E3; font-size: 12px; border: 1px solid #777777;  position:absolute; left:?px; top:?px; width:?px; height:?px; z-index:100; visibility:hidden\">");
str += "\u65f6<select id=\"_hour\">";
for (h = 8; h <= 9; h++) {
    str += "<option value=\"0" + h + "\">0" + h + "</option>";
}
for (h = 10; h <= 19; h++) {
    str += "<option value=\"" + h + "\">" + h + "</option>";
}
str += "</select> \u5206<select id=\"_minute\">";
/*
for (m = 0; m <= 9; m+=15) {
    str += "<option value=\"0" + m + "\">0" + m + "</option>";
}
for (m = 10; m <= 59; m+=15) {
    str += "<option value=\"" + m + "\">" + m + "</option>";
}
str += "<option value=\"" + 59 + "\">" + 59 + "</option>";
*/
str += "<option value=\"" + "00" + "\">" + "00" + "</option>";
str += "<option value=\"" + 15 + "\">" + 15 + "</option>";
str += "<option value=\"" + 30 + "\">" + 30 + "</option>";
str += "<option value=\"" + 45 + "\">" + 45 + "</option>";
str += "</select> <input name=\"queding\" type=\"button\" onclick=\"_select()\" value=\"\u786e\u5b9a\" style=\"font-size:12px\" /></div>";
document.writeln(str);
var _fieldname;
function _SetTime(tt) {
    _fieldname = tt;
    var ttop = tt.offsetTop;    //TT控件的定位点高
    var thei = tt.clientHeight;    //TT控件本身的高
    var tleft = tt.offsetLeft;    //TT控件的定位点宽
    while (tt = tt.offsetParent) {
        ttop += tt.offsetTop;
        tleft += tt.offsetLeft;
    }
    document.getElementById("_hour").value ="08";
    document.getElementById("_minute").value="00";
//    document.all._contents.style.top = ttop + thei + 4;
//    document.all._contents.style.left = tleft;
//    document.all._contents.style.visibility = "visible";
    document.getElementById("_contents").style.top = ttop + thei + 4 + 'px';
    document.getElementById("_contents").style.left = tleft + 'px';
    document.getElementById("_contents").style.visibility = "visible";
}
function _select() {
//    _fieldname.value = document.all._hour.value + ":" + document.all._minute.value;
//    document.all._contents.style.visibility = "hidden";
	_fieldname.value = document.getElementById("_hour").value + ":" + document.getElementById("_minute").value;
	document.getElementById("_contents").style.visibility = "hidden";
	this.value = _fieldname.value;
    $(_fieldname).trigger('change');
}

//日期时间
boot.Time = function(id){
    boot.Time.superClass.constructor.call(this, id);
};

boot.extend(boot.Time, boot.TextBox, {
    uiCls: 'boot-time',
    _initField: function(){
        boot.Time.superClass._initField.call(this);
    },
    _create: function(){
        boot.Time.superClass._create.call(this);
        this.borderEl.css("padding-right", "2px");
        this.textEl.addClass("date-image");
    },
    _setValue: function(value){
        this.value = value;
        this.textEl.val(this.value).trigger("change");
    },
    _getValue: function(){
        return this.value;
    },
    _bindEvents: function(){
        boot.Time.superClass._bindEvents.call(this);
        this._on(this.el, '.textbox-text', 'click', this._onButtonEditClick, this);
    },
    _onButtonEditClick: function(e){
        var me = this;
        _SetTime(this.textEl[0]);
        //this.value = this.textEl[0];
        
        //laydate({choose: function(dates){me._setValue(dates);}, istoday: false});
        this._fire("onbuttonclick", e);
    },
    _getAttrs: function(attributes){
        var attrs = boot.concat({
            str: ["format"],
            number: [],
            bool: [],
            json: [],
            fn: []
        }, attributes || {});
        return boot.Time.superClass._getAttrs.call(this, attrs);
    },
    
    
    //API
    getValue: function(){
        return this._getValue();
    },
    setValue: function(value){
        this._setValue(value);
    }
});

boot.Register(boot.Time, 'time');
