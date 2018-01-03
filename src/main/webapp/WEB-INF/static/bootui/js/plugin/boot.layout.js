/**
 * @author 田鑫龙
 */
boot.Layout = function(id) {
    this.layoutAttrs = {
        head: {visible: true},
        foot: {visible: true},
        left: {visible: true},
        right: {visible: true}
    };
    boot.Layout.superClass.constructor.call(this, id);
    this._getLayoutAttrs();
    this._doLayout();
};

boot.extend(boot.Layout, boot.Rooter, {
    uiCls : "boot-layout",
    type: "layout",
    _initField: function(){
        this.splitSize = this.splitSize || 0;
    },
    _create : function() {
        this.el.attr("id", this.id);
        this._createHead();
        this._createMiddle();
        this._createLeft();
        this._createCenter();
        this._createRight();
        this._createFoot();
    },
    _doLayout: function(){
        var top = 0, bottom = 0, left = 0, right = 0;
        if(this.headEl){
            var headAttrs = this.layoutAttrs["head"];
            if(headAttrs.visible === false){
                top = 0;
                this.headEl.css("border", "none");
            }else{
                top = headAttrs.height || 60;
            }
            this.headEl.css("height", top);
        }
        if(this.footEl){
            var footAttrs = this.layoutAttrs["foot"];
            if(footAttrs.visible === false){
                bottom = 0;
                this.footEl.css("border", "none");
            }else{
                bottom = footAttrs.height || 60;
            }
            this.footEl.css("height", bottom);
        }
        if(this.leftEl){
            var leftAttrs = this.layoutAttrs["left"];
            if(leftAttrs.visible === false){
                left = 0;
                this.leftEl.css({"width": left, "border": "none"});
            }else{
                left = leftAttrs.width || 120;
                this.leftEl.css("width", left);
                left += this.splitSize;
            }
        }
        if(this.rightEl){
            var rightAttrs = this.layoutAttrs["right"];
            if(rightAttrs.visible === false){
                right = 0;
                this.rightEl.css({"width": right, "border": "none"});
            }else{
                right = rightAttrs.width || 100;
                this.rightEl.css("width", right);
                right += this.splitSize;
            }
        }
        this.middleEl.css({
            top: top,
            bottom: bottom
        });
        this.centerEl.css({
            'margin-left': left,
            "margin-right": right
        });
    },
    _createHead : function() {
        this.headEl = jQuery(".layout-head", this.el);
    },
    _createMiddle : function() {
        this.middleEl = jQuery(".layout-middle", this.el);
    },
    _createFoot : function() {
        this.footEl = jQuery(".layout-foot", this.el);
    },
    _createLeft : function() {
        this.leftEl = jQuery(".layout-middle-left", this.el);
    },
    _createCenter : function() {
        this.centerEl = jQuery(".layout-middle-center", this.el);
    },
    _createRight : function() {
        this.rightEl = jQuery(".layout-middle-right", this.el);
    },
    _getLayoutAttrs: function(){
        this.layoutAttrs.head = boot._getBasicAttrs(this.headEl, {
            number : ["height"],
            bool : ["visible"]
        });
        this.layoutAttrs.left = boot._getBasicAttrs(this.leftEl, {
            number : ["width"],
            bool : ["visible"]
        });
        this.layoutAttrs.right = boot._getBasicAttrs(this.rightEl, {
            number : ["width"],
            bool : ["visible"]
        });
        this.layoutAttrs.foot = boot._getBasicAttrs(this.footEl, {
            number : ["height"],
            bool : ["visible"]
        });
    },
    _getAttrs : function(attributes) {
        var attrs = boot.concat({
            str : [],
            number: ["width", "height", "splitSize"],
            bool : [],
            css : [],
            fn : []
        }, attributes);
        
        return boot.Layout.superClass._getAttrs.call(this, attrs);
    }
});

boot.Register(boot.Layout, "layout");
