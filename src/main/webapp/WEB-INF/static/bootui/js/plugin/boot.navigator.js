/**
 * @author dragon
 */
boot.Navigator = function(id) {
    boot.Navigator.superClass.constructor.call(this, id);
    this._load();
};

boot.extend(boot.Navigator, boot.Rooter, {
    uiCls : 'boot-navigator',
    _initField : function() {
        this.textField = this.textField || 'text';
        this.childrenField = this.childrenField || 'children';
    },
    _create : function() {
        this.el.css("height", "auto");
        var borderEl = jQuery('<div class="navigator-border" style="height: auto;"></div>');
        var innerEl = jQuery('<div class="navigator-inner"></div>');
        var bodyEl = jQuery('<div class="navigator-menu-float" style="height: auto;"></div>');
        bodyEl.appendTo(innerEl);
        innerEl.appendTo(borderEl);
        borderEl.appendTo(this.el);
        this.borderEl = borderEl;
        this.bodyEl = bodyEl;
        this.contextMenu = new boot.ContextMenu(this.borderEl);
        this.contextMenu['textField'] = this.textField;
        this.contextMenu['childrenField'] = this.childrenField;
    },
    _load : function(options) {
        options = options || {};
        options.data = options.parameters || options.data || {};
        options.url = options.url || this.url;
        options.context = this;
        options.success = this._loadSuccess;

        if (options.url)
            boot.ajax(options);
    },
    //加载成功
    _loadSuccess : function(result) {
        if (result.success) {
            this._loadData(result.resultData);
        }
    },
    _loadData : function(array) {
        this.resource = array;
        this.data = array;
        this._renderMenuGroup(this.data);
        if(this.fireFirst){
        	this._fireFirst();
        }
        this._addHomeMenu();
        this._fire("onloadSuccess", {
            sender : this,
            result : array,
            asTreeResult : this.data
        });
    },
    _renderMenu : function(menu) {
        var html = '<div id="' + menu._uuid + '" class="navigator-menuitem">';
        html += '<div class="navigator-menuitem-inner">';
        if (menu.icon && menu.icon != '') {
            html += '<div class="navigator-menuitem-icon navigator-icon-' + menu.icon + '"></div>';
        }
        html += '<div class="navigator-menuitem-text">' + menu[this.textField] + '</div>';
        if (menu.children && menu.children.length > 0) {
            html += '<div class="navigator-menuitem-allow"></div>';
        }
        html += '</div>';
        html += '</div>';
        return html;
    },
    _addHomeMenu: function(){
    	var home = {
			_uuid: boot.newId(),
			_actived: false,
			action: 'home',
			icon: "home"
    	};
    	home[this.textField] = "主页";
    	this.data.splice(0, 0, home);
    	this.bodyEl.prepend('<span class="navigator-separator"></span>');
    	this.bodyEl.prepend(this._renderMenu(home));
    },
    _renderMenuGroup : function(menus) {
        menus = menus || this.data;
        var html = new boot.HTML();
        var split = '<span class="navigator-separator"></span>';
        for (var i = 0, length = menus.length; i < length; i++) {
            var menu = menus[i];
            menu._uuid = boot.newId();
            menu._actived = false;
            html.push(this._renderMenu(menu));
        }
        this.bodyEl.html(html.concat(split));
    },
    //通过uuid获取node
    _getNodeByUUID : function(uuid, field) {
        field = field || "_uuid";
        var me = this;
        function recursion(array) {
            var find = undefined;
            for (var i = 0, len = array.length; i < len; i++) {
                var node = array[i];
                if (uuid === node[field]) {
                    find = node;
                } else if (node[me.childrenField] && node[me.childrenField].length > 0) {
                    find = recursion(node[me.childrenField]);
                }
                if (find) {
                    break;
                }
            }
            return find;
        }

        return recursion(this.data);
    },
    _fireFirst: function(){
    	var me = this;
    	function recursion(array) {
            for (var i = 0, len = array.length; i < len; i++) {
                var node = array[i];
                if (node[me.childrenField] && node[me.childrenField].length > 0) {
                    return recursion(node[me.childrenField]);
                }else{
                	return node;
                }
            }
        }

        var first = recursion(this.data);
        this._fire('onitemclick', {
        	sender: this,
        	item: first
        });
    },
    _changeActived: function(el, item){
        if(el) el.addClass("hover");
        if(this.activedEl){
          this.activedEl.removeClass("hover");
        }
        this.activedEl = el;
        this.activedItem = item;
    },
    _bindEvents : function() {
        this._on(this.bodyEl, '.navigator-menuitem', 'mouseenter', this._onMenuMouseEnter, this);
        this._on(this.el, '.navigator-border', 'mouseleave', this._onNavigatorMouseLeave, this);
        this._on(this.bodyEl, '.navigator-menuitem', 'click', this._onMenuItemClick, this);
        this._on(this.bodyEl, '.navigator-menuitem', 'contextmenu', this._onNavigatorItemClick, this);
        this._on(this.el, '.item', 'contextmenu', this._onContextMenu, this);
        this._on(this.el, ':checkbox', 'click', this._onAddQuickButtonClick, this);
        this.bind('bodyclick', this._onBodyClick, this);
        this.contextMenu.bind('itemclick', this._onItemClick, this);
        this.contextMenu.bind('itemleave', this._onItemLeave, this);
    },
    _onMenuItemClick : function(e) {
        e.stopPropagation();
        var el = e.selector;
        var id = el.attr("id");
        var offset = el.offset();
        var node = this._getNodeByUUID(id);
        if(node.action && node.action == 'home'){
            window.closeWindow();
        }else{
            if (!(node[this.childrenField] && node[this.childrenField].length > 0)) {
                this._onItemClick(e);
            }
        }
    },
    _onNavigatorMouseLeave: function(){
        this._changeActived();
        this.contextMenu._hide();
    },
    _onAddQuickButtonClick: function(e){
        e.preventDefault();
        var el = e.selector;
        var id = el.attr("id").split('$')[0];
        var node = this.contextMenu._getNodeByUUID(id) || this._getNodeByUUID(id);
        this._updateQuick(node, el);
        jQuery("#" + id +"\\$quick", this.el).remove();
    },
    _updateQuick: function(node, el){
        var old = el.prop("checked") ? 1 : 0;
        node.isQuick = old;
        if(this.quickUrl){
            boot.ajax({
                url: this.quickUrl,
                data: boot.addPrefix(node, 'menuEntity'),
                context: this,
                success: function(result){
                    if(result.success){
                        el.prop(!old);
                    }
                }
            });
        }
    },
    _onItemLeave : function(e) {
        var el = e.selector;
        var sender = e.sender;
        var id = el.attr("id");
        el.children("#" + id.replace(/\$\w+/, "\\$quick")).remove();
    },
    _onItemClick : function(e) {
        var el = e.selector;
        var sender = e.sender;
        var id = el.attr("id");
        var node = e.item || sender._getNodeByUUID(id);
        e.item = node;
        this._changeActived();
        this._fire('onitemclick', e);
    },
    _onBodyClick : function() {
        if (this.contextMenu) {
            this.contextMenu._hide();
            this._changeActived();
        }
    },
    _onMenuMouseEnter : function(e) {
        e.stopPropagation();
        var el = e.selector;
        var id = el.attr("id");
        var offset = el.offset();
        var node = this._getNodeByUUID(id);
        if(this.activedItem){
            if(this.activedItem._uuid === node._uuid){
                return ;
            }
        }
        this._changeActived(el, node);
        if (node[this.childrenField] && node[this.childrenField].length > 0) {
            this.contextMenu._setData(node[this.childrenField]);
            this.contextMenu._setPosition({
                top : offset.top + el.height(),
                left : offset.left
            });
            this.contextMenu._show();
            el.css('border-bottom', 'none');
        }else{
        	this.contextMenu._hide();
        }
    },
    _onContextMenu : function(e) {
        e.preventDefault();
        if (this.contextMenu) {
            this._addMyQuickly(e);
        }
        return false;
    },
    _onNavigatorItemClick : function(e) {
        var el = e.selector;
        var id = el.attr("id");
        var node = this._getNodeByUUID(id);
        e.menu = node;
    	this._onContextMenu(e);
    },
    _addMyQuickly : function(e) {
        var el = e.selector;
        var position = el.position();
        var id = el.attr("id");
        var menu = e.menu || this.contextMenu._getNodeByUUID(id);
        if(!menu["children"] || menu['children'] && menu['children'].length == 0){
            var top = position.top, left = position.left + el.width() - 10;
            var html = '<div id="'+ menu._uuid +'$quick" style="cursor: pointer;z-index: 11;border: 1px solid #C9C9C9;background-color: #fff;position: absolute;top: ' + top + 'px;left: ' + left + 'px;width: 74px;height: 24px;">';
            html += '<input id="' + menu._uuid + '$checkbox" type="checkbox" style="float: left;margin: 6px 4px;"/>';
            html += '<label for="' + menu._uuid + '$checkbox" style="font-size: 12px;display: inline-block;font-size: 12px;float: left;height: 24px;line-height: 24px;">加入快捷</label>';
            html += '</div>';
            el.after(html);
        }
    },
    _getAttrs : function(attributes) {
        var attrs = boot.concat({
            str : ['textField', "childrenField", 'url', "binding", "quickUrl"],
            bool : ["fireFirst"]
        }, attributes);
        return boot.Navigator.superClass._getAttrs.call(this, attrs);
    }
});

boot.Register(boot.Navigator, 'navigator');
