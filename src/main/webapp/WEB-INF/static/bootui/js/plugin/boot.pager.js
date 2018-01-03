/**
 * @author 田鑫龙
 */
boot.Pager = function(id){
    this._initEls();
    boot.Pager.superClass.constructor.call(this, id);
};

boot.extend(boot.Pager, boot.Rooter, {
    uiCls: "boot-pager",
    type: "pager",
    _initField: function(){
        var empty = function(){};
        this.pagerEvents = {
            skipEvent: empty,
            sizeEvent: empty,
            reloadEvent: empty,
            prevEvent: empty,
            nextEvent: empty,
            firstEvent: empty,
            lastEvent: empty
        };
    },
    _initEls: function(){
        this.sizeEl = boot.newId();
        this.firstEl = boot.newId();
        this.lastEl = boot.newId();
        this.nextEl = boot.newId();
        this.prevEl = boot.newId();
        this.reloadEl = boot.newId();
        this.skipEl = boot.newId();
        this.totalEl = boot.newId();
        this.infoEl = boot.newId();
    },
    _create: function(parent){
            var html = [];
            html.push('<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;height: 100%;">');
            html.push('<tr>');
            html.push('<td valign="middle">');
            html.push('<span class="boot-combobox" width="60" height="18" id="'+ this.sizeEl +'"></span>');
            html.push('<span class="separator"></span>');
            html.push('<a class="boot-button button-plain pager-noText" action="firstEvent" id="'+ this.firstEl +'" iconCls="first"></a>');
            html.push('<a class="boot-button button-plain pager-noText" action="prevEvent" id="'+ this.prevEl +'" iconCls="prev"></a>');
            html.push('<input type="text" class="boot-textbox" width="40" height="18" value="1" id="'+ this.skipEl +'"/>');
            html.push('<span id="'+ this.totalEl +'" class="total" style="vertical-align: middle;display: inline-block;margin-left: 8px;">/ 1</span>');
            html.push('<a class="boot-button button-plain pager-noText" action="nextEvent" id="'+ this.nextEl +'" iconCls="next"></a>');
            html.push('<a class="boot-button button-plain pager-noText" action="lastEvent" id="'+ this.lastEl +'" iconCls="last"></a>');
            html.push('<span class="separator"></span>');
            html.push('<a class="boot-button button-plain pager-noText" action="reloadEvent" id="'+ this.reloadEl +'" iconCls="reload"></a>');
            html.push('</td>');
            html.push('<td style="text-align: right;padding-right: 10px;"><span id="'+ this.infoEl +'">每页 0 条,共 0 条</span></td>');
            html.push('</tr>');
            html.push('</table>');
            
            this.el.html(html.join(""));
            boot.parse(this.sizeEl);
            boot.parse(this.skipEl);
            
            boot.parse(this.firstEl);
            boot.parse(this.lastEl);
            boot.parse(this.nextEl);
            boot.parse(this.prevEl);
            boot.parse(this.reloadEl);
            this._covertEls();
    },
    _covertEls: function(){
        this.sizeEl = boot.get(this.sizeEl);
        this.firstEl = jQuery("#" + this.firstEl);
        this.lastEl = jQuery("#" + this.lastEl);
        this.nextEl = jQuery("#" + this.nextEl);
        this.prevEl = jQuery("#" + this.prevEl);
        this.reloadEl = jQuery("#" + this.reloadEl);
        this.skipEl = boot.get(this.skipEl);
        this.totalEl = jQuery("#" + this.totalEl);
        this.infoEl = jQuery("#" + this.infoEl);
    },
    _setSizeList: function(list){
        for(var i=0;i<list.length;i++){
            var size = list[i];
            var o = {
                "id" : size,
                "name" : size
            }; 
            list[i] = o;
        }
        this.sizeEl._loadData(list);
    },
    _setPageSize: function(size){
        if(this.sizeEl){
            this.sizeEl.setValue(size);
        }
    },
    _buttonEventRegister: function(fn, scope){
        fn.call(this, scope);
        //绑定下拉框事件，切换显示条数
        this.sizeEl.bind('change', this.pagerEvents['sizeEvent'], this);
        //跳转到哪一页
        this.skipEl.bind('enterpress', this.pagerEvents['skipEvent'], this);
    },
    _bindEvents: function(){
        this._on(this.el, ".boot-button", 'click', this._onPagerButtonClick, this);
    },
    //分页按钮点击事件
    _onPagerButtonClick: function(e){
        var el = e.selector;
        var button = boot.get(el[0].id);
        this.pagerEvents[button.action].call(this, e);
    },
    _getAttrs: function(attributes){
        var attrs = boot.concat({
            str: ["id", "style"]
        }, attributes || {});
        return boot.Pager.superClass._getAttrs.call(this, attrs);
    }
});

boot.Register(boot.Pager, "pager");
