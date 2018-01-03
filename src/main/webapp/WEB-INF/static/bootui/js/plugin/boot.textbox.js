/**
 * @author 田鑫龙
 */
//文本输入框
boot.TextBox = function(id) {
    this.required = false;
    boot.TextBox.superClass.constructor.call(this, id);
    this._setWidth();
    this._setHeight();
};

boot.extend(boot.TextBox, boot.Rooter, {
    uiCls : 'boot-textbox',
    type : "text",
    _initField : function() {
        this.validateValue = true;
        boot.TextBox.superClass._initField.call(this);
        this.maxLength = this.maxLength || 9999999;
        this.minLength = this.minLength || 0;
        this.emptyText = this.emptyText ? ('请输入' + this.emptyText) : '';
        this.width = this.width || 150;
        this.height = this.height || 22;
        this.value = this.value || "";
    },
    _create : function() {
        var container = jQuery('<span id="' + this.id + '" class="boot-textbox" style="display: inline-block;overflow: hidden;position: relative;vertical-align: middle;"></span>');
        var borderHTML = '<span class="textbox-border" style="display: block;position: relative;padding: 0 2px;';
        if(this.showBorder === false){
            borderHTML += 'border: none;';
        }
        borderHTML += '"></span>';
        var border = jQuery(borderHTML);
        var emptyEl = jQuery('<label style="' + (this.value && this.value != '' ? 'display: none;' : '') + 'position: absolute;top: 0;left :2px;color: gray;cursor: text;">' + this.emptyText + '</label>').appendTo(border);
        var input = jQuery("<input>", {
            name : this.name,
            id : this.id + '$text',
            type : "text",
            readonly : this.allowEdit === false ? true : false,
            disabled : this.enabled === false ? true : false,
            "class" : "textbox-text",
            value : this.value
        }).appendTo(border.appendTo(container));
        
        var errorEl = jQuery('<span class="error" title="'+ (this.errorText || '') +'"></span>');
        errorEl.appendTo(container);
        this.errorEl = errorEl;

        this.el.after(container);
        //插入新创建的元素
        this.el.remove();
        //移除旧的元素
        this.el = container;
        this.textEl = input;
        this.borderEl = border;
        this.emptyEl = emptyEl;
        
        if(this.onlyView){
        	this.textEl.prop("disabled", true);
        	this.borderEl.css("border-color", "transparent");
        }
    },
    _setWidth : function(width) {
        if (!/\;*\s*width\s*:\s*/.test(this.style)) {
            this.el.css({
                width : width || this.width
            });
        }
    },
    _setHeight : function(height) {
        this.borderEl.css({
            "line-height" : (height || this.height) + 'px',
            height : height || this.height
        });
    },
    _setValue : function(value) {
        this.value = value;
        this.textEl.val(value).trigger("change");
    },
    _getValue : function() {
        return this.value;
    },
    _getData : function() {
        return this.data;
    },
    _validate : function() {
        var v = new boot.Validate();
        v.setRequired(this.required);
        v.setValue(this._getValue());
        v.setVType(this.vType);
        v.setErrorText(this.errorText);
        var result = v.execute();
        if(!result){
            this.el.removeClass("error");
        }else{
            this.el.addClass('error');
        }
        this.errorEl.prop('title', result);
        this.validateValue = !result;
        return this.validateValue;
    },
    _bindEvents : function() {
        this._on(this.el, ":text", "change", this._onTextChange, this);
        this._on(this.el, ":text", "change", this._onTextChangeForEmptyText, this);
        this._on(this.el, ":text", "keypress", this._onEnterPress, this);

        this._on(this.el, ":text", "keydown", this._onTextKeyDown, this);
        this._on(this.el, ":text", "keyup", this._onTextKeyUp, this);
        this._on(this.el, ":text", "blur", this._onTextBlur, this);
        this._on(this.el, ":text", "focus", this._onTextFocus, this);

        this._on(this.el, "label", "click", this._onPlaceHorderClick, this);
    },
    _onTextChangeForEmptyText : function() {
        if (this.emptyText != '') {
            if (this.textEl.val() != '') {
                this.emptyEl.hide();
            } else {
                this.emptyEl.show();
            }
        }
    },
    _onTextChange : function(e) {
        this.value = this.textEl.val();
        this._validate();
        this._fire('onchange', e);
    },
    _onEnterPress : function(e) {
        if (e.event.keyCode == "13") {
            this._fire('onenterpress', e);
        }
    },
    _onTextKeyDown : function(e) {
        if (this.value.length < this.minLength) {
            boot.showTip('不得少于' + this.minLength + '限制!');
            return false;
        }
        if (this.value.length >= this.maxLength) {
            boot.showTip('不得超过' + this.maxLength + '限制!');
            return false;
        }
        this._fire('onkeydown', e);
    },
    _onTextKeyUp : function(e) {
        if (this.emptyText != '') {
            if (this.textEl.val() != '') {
                this.emptyEl.hide();
            } else {
                this.emptyEl.show();
            }
        }
        this._fire('onkeyup', e);
    },
    _onTextFocus : function(e) {
        this._fire('onfocus', e);
    },
    _onTextBlur : function(e) {
        this._validate();
        this._fire('onblur', e);
    },
    _onPlaceHorderClick : function() {
        this.textEl && this.textEl.trigger('focus');
    },
    _getAttrs : function(attributes) {
        var attrs = boot.concat({
            str : ["name", "value", "style", "emptyText", "vType", "errorText"],
            number : ["width", "height", "maxLength", "minLength"],
            bool : ["allowEdit", "enabled", "required", "showBorder", "onlyView"],
            json : [],
            fn : ["onchange", "onblur"]
        }, attributes || {});
        return boot.TextBox.superClass._getAttrs.call(this, attrs);
    },

    //API
    getValue : function() {
        return this._getValue();
    },
    setValue : function(value) {
        this._setValue(value);
    }
});

boot.Register(boot.TextBox, 'textbox');