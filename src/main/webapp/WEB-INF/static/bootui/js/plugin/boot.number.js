/**
 * @author 田鑫龙
 */
//Number类型
boot.Number = function(id) {
    boot.Number.superClass.constructor.call(this, id);
};

boot.extend(boot.Number, boot.TextBox, {
    uiCls : "boot-number",
    _initField : function() {
        boot.Number.superClass._initField.call(this);
        this.format = this.format || "c0";
        this.formatFixed = Number(this.format.replace(/[a-zA-Z]/g, ''));
        this.formatType = this.format.replace(/[0-9]/g, '');
        this.fixed = this.formatType == 'p' ? 100 : 1;
        this.value = this.value * this.fixed || 0;
        this.maxValue = this.maxValue || 9999999999999;
        this.minValue = this.minValue || -9999999999999;
        this.symbol = this.formatType == 'p' ? "%" : "&yen;";
    },
    _create : function() {
        boot.Number.superClass._create.call(this);
        this.textEl.css({
            "text-align" : "right",
            "ime-mode" : "disabled"
        });
        this._decimalFormat(this.value);
        this.borderEl.css("padding-right", "18px");
        this.symbolEl = jQuery('<span class="number-symbol">'+ this.symbol +'</span>');
        this.borderEl.append(this.symbolEl);
        
        if(this.onlyView){
        	this.symbolEl.css({
        		"border-left": "none",
        		"background-color": "transparent"
        	});
        }
    },
    _setValue : function(value) {
        this._decimalFormat(value * this.fixed);
        this.textEl.trigger('click');
    },
    _bindEvents : function() {
        boot.Number.superClass._bindEvents.call(this);
    },
    _onTextFocus : function(e) {
        this.textEl.val(this.formatValue);
        this._fire('onfocus', e);
        var me = this;
        window.setTimeout(function() {
            me.textEl.select();
        }, 0);

    },
    _onTextKeyDown : function(e) {
        this._fire('onkeydown', e);
    },
    _onTextChange : function(e) {
        this._fire('onchange', e);
    },
    _onTextBlur : function(e) {
        var value = this._compare(this.textEl.val());
        this._decimalFormat(value);
        this._validate();
        this._fire('onblur', e);
    },
    //比较是否合法
    _compare: function(value){
        value = this._filterIllegalChar(value);
        var compareValue = value / this.fixed;
        if (compareValue > this.maxValue) {
            value = this.maxValue;
        }
        if (compareValue < this.minValue) {
            value = this.minValue;
        }
        return String(value);
    },
    //过滤非法字符
    _filterIllegalChar : function(value) {
        for (var i = 0; i < value.length; i++) {
            var _char = value.charAt(i);
            if (!/[0-9|\.|\-]/.test(_char)) {
                value = value.split(_char).join("");
            }
        }
        return value;
    },
    //格式化方法
    _decimalFormat : function(number) {
        number = String(number) || "";
        var clearRegExp = /\D*/ig, empty = '';
        var minus = /\-/.test(number) ? -1 : 1;
        var numbers = number.split('.'), number0 = numbers[0].replace(clearRegExp, empty), number1 = (numbers[1] || "").replace(clearRegExp, empty);

        number0 = this._splitByGroup(number0);
        number1 = (Number(number1) * Math.pow(0.1, number1.length)).toFixed(this.formatFixed) * Math.pow(10, this.formatFixed);
        number1 = parseInt(number1);

        if (number1 == 0) {
            number1 = new Array(this.formatFixed + 1).join("0");
        }

        if(this.formatFixed == 0){
            number = number0;
        }else{
            number = number0 + "." + number1;
        }
        
        this.formatValue = number.replace(/\,/, '');

        this.value = this.formatValue / this.fixed;
        
        this.textEl.val(number);

        return number;
    },
    _splitByGroup : function(str) {
        var len = str.length, array = [], start = 0, end = len % 3, step = Math.ceil(len / 3);

        for (var i = 0; i <= step; i++) {
            var subStr = str.substring(start, end);
            if (subStr != '')
                array.push(subStr);
            start = end;
            end = start + 3;
        }
        return array.join(',') || "0";
    },
    _getAttrs : function(attributes) {
        var attrs = boot.concat({
            str : ["format"],
            number : ["maxValue", "minValue"],
            fn : []
        }, attributes || {});
        return boot.Number.superClass._getAttrs.call(this, attrs);
    }
});

boot.Register(boot.Number, 'number'); 