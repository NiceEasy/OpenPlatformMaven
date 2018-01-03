/**
 * @author 田鑫龙
 */
//下拉框
boot.ComboBox = function(id){
    this.data = [];
    boot.ComboBox.superClass.constructor.call(this, id);
};

boot.extend(boot.ComboBox, boot.PopupEdit, {
    uiCls: 'boot-combobox',
    _initField: function(){
        boot.PopupEdit.superClass._initField.call(this);
        this.popupHeight = this.popupHeight || 120;
    },
    _create: function(){
        boot.ComboBox.superClass._create.call(this);
        this._createListBox();
    },
    _createListBox: function(){
        var id = this._uuid +'$box';
        var width = (this.popupWidth || this.el.width());
        var html = '<div id="'+ id +'" class="boot-listbox" ';
        if(this.url){
            html += 'url="'+ this.url +'" ';
        }else{
            html += 'autoLoad="false" ';
        }
        html += 'style="position:absolute;display: none;width: '+ width +'px;"></div>';
        jQuery(document.body).append(html);
        boot.parse(id.replace('$', '\\$'));
        this.listBox = boot.get(id);
        this.listBox._loadData(this.data);
    },
    _loadData: function(data){
        this.listBox._loadSuccess(data);
    },
    _setUrl: function(url){
        this.url = url;
        this.listBox.url = url;
        this.listBox._load();
    },
    _setText: function(text){
    },
    _setValue: function(value){
        this.listBox._setValue(value);
        this.value = value;
    },
    _setPopupListPosition: function(box) {
        var winHeight = $(document.body).height();
        if (winHeight - box.top > this.listBox.height) {
            box.top = box.top + box.height;
        }else{
            box.top -= this.listBox.height;
        }
        delete box.height;
        this.listBox.el.css(box);
        this.listBox._show();
    },

    _bindEvents: function(){
        boot.ComboBox.superClass._bindEvents.call(this);
        this.listBox.bind('itemclick', this._onItemClick, this);
        this.listBox.bind('setvalue', this._onListBoxLoadSuccess, this);
        this.listBox.bind('loadsuccess', this._onListBoxLoadSuccess, this);
        this.bind('bodyclick', this._onBodyClick, this);
    },
    _onListBoxLoadSuccess: function(e){
        this.value = e.value;
        this.text = e.text;
        this.textEl.val(this.text);
        this.textEl.trigger('change');
    },
    _onBodyClick: function(){
        this.listBox._hide();
    },
    _onButtonEditClick: function(e){
        e.stopPropagation();
        var box = this._getBox();
        this._setPopupListPosition(box);
        
        this._fire("buttonclick", e);
    },
    _onItemClick: function(e){
        e.stopPropagation();
        this.value = e.value;
        this.text = e.text;
        this.textEl.val(this.text);
        this.textEl.trigger('change');
        this.listBox._hide();
        this._fire("itemclick", e);
    },
    _getAttrs: function(attributes){
        var attrs = boot.concat({
            str: ["url", "popupHeight", "popupWidth"],
            bool: [],
            json: ["data"],
            fn: []
        }, attributes || {});
        return boot.ComboBox.superClass._getAttrs.call(this, attrs);
    },
    
    //API
    getData: function(){
        return this.listBox._getData();
    },
    setData: function(data){
        this.listBox._loadData(data);
    },
    setUrl: function(url){
        this._setUrl(url);
    },
    clearAll: function(){
        this.listBox.clearAll();
    }
});

boot.Register(boot.ComboBox, 'combobox');
