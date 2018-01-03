/**
 * @author 田鑫龙
 */
boot.Tabs = function(id) {
    this.tabs = [];
    this.activeTab = undefined;
    boot.Tabs.superClass.constructor.call(this, id);
};

boot.extend(boot.Tabs, boot.Rooter, {
    uiCls : 'boot-tabs',
    _initField : function() {
        this.textField = this.textField || 'text';
        this.menuList = [{
            text : '刷新'
        }, {
            text : '关闭当前'
        }, {
            text : '关闭其他'
        }, {
            text : '全部关闭'
        }, {
            text : '关闭左边'
        }, {
            text : '关闭右边'
        }];
    },
    _create : function() {
        this._convertInnerTab();
        this.el.css("position", "relative");
        var tabs = jQuery('<div class="tabs-head" style="height: 26px;position: relative;border-width: 1px;border-style: solid;;border-bottom: none;"></div>');
        tabs.appendTo(this.el);
        var body = jQuery('<div class="tabs-body" style="top: 26px;position: absolute;bottom: 0px;left: 0;right: 0;border-width: 1px;border-style: solid;"></div>');
        body.appendTo(this.el);
        this.headEl = tabs;
        this.bodyEl = body;
        this.contextMenu = new boot.ContextMenu(this.el);
        this.contextMenu['textField'] = this.textField;
        
        this._renderTabs();
    },
    _convertInnerTab : function() {
        var array = this.el.children().toArray();
        for (var index in array) {
            var el = $(array[index]);
            var tab = new boot.Tab(el);
            this.tabs.push(tab);
        }
        this.el.empty();
    },
    _renderTabs : function() {
        var tabs = '';
        for (var i = 0, len = this.tabs.length; i < len; i++) {
            var tab = this.tabs[i];
            if (tab.contentEl == undefined) {
                this._createContentBody(tab);
            }else if(tab._actived){
                tab.contentEl.show();
            }
            tabs += this._createTab(tab);
        }
        this.headEl.html(tabs);
    },
    _addTab : function(tab) {
        tab = new boot.Tab(tab);
        this.tabs.push(tab);
        this._changeActivedTab(tab);
        this._renderTabs();
    },
    _changeActivedTab : function(tab) {
        if (this.activeTab) {
            if (this.activeTab._uuid === tab._uuid) {
                return false;
            }
            this.activeTab._actived = false;
            this.activeTab.contentEl.hide();
        }
        tab._actived = true;
        this.activeTab = tab;
        return true;
    },
    //创建页签
    _createTab : function(tab) {
        var html = "";
        var id = tab._uuid + '$tab';
        var zIndex = '', activeCls = '';
        if (tab._actived) {
            activeCls = ' tabs-tab-actived';
            zIndex = 'z-index: 10;';
            this._changeActivedTab(tab);
        }
        html += '<div id="' + id + '" class="tabs-tab' + activeCls + '" style="position: relative;display: inline-block;border-style: solid;border-width: 1px;padding: 3px 8px 3px 8px;text-align: center;cursor: pointer;white-space: nowrap;bottom: -3px;border-bottom: none;margin-left: 2px;height: 16px;' + zIndex + '">';
        if (tab.icon) {
            html += '<img alt="" src="' + tab.icon + '" class="tab-icon" style="width: 14px;height: 14px;"/>';
        }
        html += '<span class="tab-text" style="height: 16px;line-height: 15px;vertical-align: middle;">' + tab[this.textField] + '</span>';
        if (this.allowClose && tab.allowClose) {
            var closeId = tab._uuid + "$close";
            html += '<span id="' + closeId + '" class="tab-close" style="width: 14px;height: 14px;display: inline-block;vertical-align: middle;"></span>';
        }
        html += '</div>';
        return html;
    },
    //创建body
    _createContentBody : function(tab) {
        var id = tab._uuid + '$body';
        var html = '<div id="' + id + '" class="tabs-body-content" ';
        if(tab._actived){
            html += 'style="position: absolute;width: 100%;height: 100%;">';
        }else{
            html += 'style="position: absolute;width: 100%;height: 100%;display: none;">';
        }
        if (tab.url) {
            var src = tab.url;
            if (tab.url.indexOf("?") != -1) {
                src += "&_random=" + new Date().getTime();
            } else {
                src += "?_random=" + new Date().getTime();
            }
            html += '<iframe src="' + src + '" style="border: none;width: 100%;height: 100%;"></iframe>';
        }
        html += '</div>';
        this.bodyEl.append(html);
        id = id.replace(/\$/, '\\$');
        tab.contentEl = tab.contentEl || jQuery("#" + id, this.bodyEl);
        tab.iframe = tab.contentEl.children();
        this._bindIframeOnload(tab, this);
    },
    _bindIframeOnload: function(tab, sender){
        var frame = tab.iframe;
        if(frame && frame[0]){
            var iframe = frame[0];
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function(e) {
                    e.sender = sender;
                    tab.onload && tab.onload.call(sender, e);
                    tab._loaded = true;
                });
            } else {
                iframe.onload = function(e) {
                    e.sender = sender;
                    tab.onload && tab.onload.call(sender, e);
                    tab._loaded = true;
                };
            }  
        }

    },
    //根据UUID查找tab对象
    _getTabByUUID : function(uuid) {
        for (var i = 0, len = this.tabs.length; i < len; i++) {
            var tab = this.tabs[i];
            if (tab._uuid === uuid) {
                return tab;
            }
        }
    },
    //销毁方法
    _destory : function(uuid) {
        for (var i = 0, len = this.tabs.length; i < len; i++) {
            var tab = this.tabs[i];
            if (tab._uuid === uuid) {
                if (tab._actived) {
                    var closet = this.tabs[i - 1] || this.tabs[i + 1];
                    if (closet) {
                        closet._actived = true;
                        this._changeActivedTab(closet);
                    } else {
                        this.activeTab = null;
                    }
                }
                tab.contentEl.remove();
                tab.contentEl = null;
                this.tabs.splice(i, 1);
                break;
            }
        }
        this._renderTabs();
    },
    _bindEvents : function() {
        this._on(this.headEl, '.tabs-tab', 'click', this._onTabClick, this);
        this._on(this.headEl, '.tabs-tab', 'contextmenu', this._onContextMenu, this);
        this._on(this.headEl, '.tab-close', 'click', this._onTabCloseClick, this);
        this.contextMenu.bind('itemclick', this._onItemClick, this);
        this.bind('bodyclick', this._onBodyClick, this);
    },
    _onItemClick : function(e) {
        var el = e.selector;
        var sender = e.sender;
        var id = el.attr("id");
        var node = sender._getNodeByUUID(id);
        var tab = this.contextMenu.trigger;
    },
    _onBodyClick : function() {
        if (this.contextMenu) {
            this.contextMenu._hide();
        }
    },
    _onContextMenu : function(e) {
        e.preventDefault();
        var el = e.selector;
        var id = el.attr("id");
        var tab = this._getTabByUUID(id);
        this.contextMenu._setData(this.menuList);
        this.contextMenu._setPosition({
            top : e.jQueryEvent.pageY,
            left : e.jQueryEvent.pageX
        });
        this.contextMenu.trigger = tab;
        this.contextMenu._show();
    },
    _onTabClick : function(e) {
        var el = e.selector;
        var id = el.attr("id").split("$")[0];
        var tab = this._getTabByUUID(id);
        var action = this._changeActivedTab(tab);
        if (action)
            this._renderTabs();
    },
    _onTabCloseClick : function(e) {
        e.stopPropagation();
        var el = e.selector;
        var id = el.attr("id").split("$")[0];
        this._destory(id);

    },
    _getAttrs : function(attributes) {
        var attrs = boot.concat({
            str : ["textField"],
            bool : ["allowClose"],
            json : [],
            fn : []
        }, attributes || {});
        return boot.Tabs.superClass._getAttrs.call(this, attrs);
    },

    //API
    addTab : function(tab) {
        this._addTab(tab);
    },
    getIframeByIndex: function(index){
    	return this.tabs[index].iframe;
    }
});

boot.Register(boot.Tabs, 'tabs');

//Tab对象
boot.Tab = function(tab) {
    this._uuid = boot.newId(), 
    this._visible = true, 
    this._enabled = true, 
    this._actived = false, 
    this._loaded = false, 
    this.refreshOnClick = false;

    this._init(tab);
};

boot.Tab.prototype = {
    _init : function(tab) {
        if ( tab instanceof jQuery) {
            this._getAttrs(tab);
            this.el = tab;
        } else if (jQuery.type(tab) === 'object') {
            boot.concat(this, tab);
        }
    },
    _getAttrs : function(el) {
        if (!el) {
            return;
        }
        this.text = el.text();
        var attrs = {
            str : ["name", "text", "url"],
            bool : ["refreshOnClick", "actived"]
        };
        boot.concat(this, boot._getBasicAttrs(el, attrs));
        this._actived = this.actived;
        delete this.actived;
    }
};
