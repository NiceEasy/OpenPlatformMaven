/**
 * @author 田鑫龙
 */
//下拉框
boot.AutoComplete = function(id){
    boot.AutoComplete.superClass.constructor.call(this, id);
};

boot.extend(boot.AutoComplete, boot.ComboBox, {
    uiCls: 'boot-autocomplete',
    _create: function(){
        boot.AutoComplete.superClass._create.call(this);
        this.borderEl.css("padding-right", "2px");
        this._createListBox();
        this.textEl.attr("readonly", false);
        this.buttonEl.hide();
    },
    _load: function(options){
        this.borderEl.addClass("autocomplete-load");
        options = options || {};
        options.url = options.url || this.url,
        options.context = this;
        options.data = options.data || [];
        options.success = options.success || this._loadSuccess;
        if(options.url){
            boot.ajax(options);
        }else{
            this._loadData(options.data);
        }
    },
    _loadSuccess: function(data){
        this._index = 0;
        this.data = data;
        this._renderListBox();
        var box = this._getBox();
        box.top = box.top + box.height;
        delete box.height;
        box.width = box.width - 2;
        box["max-height"] = this.popupHeight || 120;
        this.comboEl.css(box);
        this.comboEl.show();
        this.borderEl.removeClass("autocomplete-load");
    },
    _setValue: function(value){
        this.value = value;
        this.tempValue = value;
        if(this.textEl)
            this.textEl.trigger("change");
    },
    _bindEvents: function(){
        boot.AutoComplete.superClass._bindEvents.call(this);
        this._on(this.el, ":text", 'keyup', this.onIntervalQuery, this);
        this._on(this.el, ":text", 'click', this.onTextClick, this);
        if(this.comboEl){
            this._on(this.comboEl,'td', 'click', this._onItemClick, this);
            $(document.body).on('click', {comboEl: this.comboEl}, function(e){
                e.data.comboEl.hide();
            });
        }
    },
    _onButtonEditClick: function(e){
        this.textEl.trigger("focus");
    },
    onTextClick: function(e){
        e.stopPropagation();
    },
    onIntervalQuery: function(e){
        e.stopPropagation();
        this.value = e.sender.textEl.val();
        if(this.start == undefined){
            var me = this;
            this.start = window.setInterval(function(){
                if(me.tempValue != me.value){
                    me._load({data: {key: me.value}});
                    me._setValue(me.value);
                }
            }, 1500);
            this.interval = window.setInterval(function(){
                if(me.tempValue == me.value || me.start != undefined){
                    window.clearInterval(me.start);
                    window.clearInterval(me.interval);
                    me.start = undefined;
                    me.interval = undefined;
                }
            }, 5000);
            
            this._load({data: {key: this.value}});
            this._setValue(this.value);
        }
    },
    _onItemClick: function(e){
        e.sender.comboInnerEl.empty();
    },
    
    _getAttrs: function(attributes){
        var attrs = boot.concat({
            str: [],
            bool: [],
            json: ["data"],
            fn: []
        }, attributes || {});
        return boot.AutoComplete.superClass._getAttrs.call(this, attrs);
    }
    
    //API
    
});

boot.Register(boot.AutoComplete, 'autocomplete');
