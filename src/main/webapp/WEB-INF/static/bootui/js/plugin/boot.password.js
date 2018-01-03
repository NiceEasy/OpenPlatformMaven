/**
 * @author 田鑫龙
 */
//密码输入框
boot.Password = function(id){
    boot.Password.superClass.constructor.call(this, id);
};

boot.extend(boot.Password, boot.TextBox, {
    uiCls: 'boot-password',
    _create: function(){
        var container = jQuery("<span id=\""+ this.id +"\" class=\"boot-password boot-textbox\"></span>");
        var borderHTML = '<span class="textbox-border textarea-border" style="display: block;position: relative;padding: 0 2px;';
        if(this.showBorder === false){
            borderHTML += 'border: none;';
        }
        borderHTML += '"></span>';
        var border = jQuery(borderHTML);
        var emptyEl = jQuery('<label style="'+ (this.value && this.value != '' ? 'display: none;' : '') +'position: absolute;top: 0;left :2px;color: gray;cursor: text;">' + this.emptyText + '</label>').appendTo(border);
        var input = jQuery("<input>", {
            id: this.id + '$text',
            name: this.name,
            type: "password",
            "class": "textbox-text",
            value: this.value,
            readonly: this.allowEdit === false ? true : false,
            disabled: this.enabled === false ? true : false
        }).appendTo(border.appendTo(container)); 
        var errorEl = jQuery('<span class="error" title="'+ (this.errorText || '') +'"></span>');
        errorEl.appendTo(container);
        this.errorEl = errorEl;
        
        this.el.after(container);//插入新创建的元素
        this.el.remove();//移除旧的元素
        this.el = container;
        this.textEl = input;
        this.borderEl = border;
        this.emptyEl = emptyEl;
        
        if(this.onlyView){
        	this.textEl.prop("disabled", true);
        	this.borderEl.css("border-color", "transparent");
        }
    },
    _bindEvents: function(){
        this._on(this.el, ":password", "change", this._onTextChange, this);
        this._on(this.el, ":password", "change", this._onTextChangeForEmptyText, this);
        this._on(this.el, ":password", "keypress", this._onEnterPress, this);
        this._on(this.el, ":password", "keydown", this._onTextKeyDown, this);
        this._on(this.el, ":password", "keyup", this._onTextKeyUp, this);
        this._on(this.el, ":password", "blur", this._onTextBlur, this);
        this._on(this.el, ":password", "focus", this._onTextFocus, this);
        this._on(this.el, "label", "click", this._onPlaceHorderClick, this);
    }
});

boot.Register(boot.Password, 'password');
