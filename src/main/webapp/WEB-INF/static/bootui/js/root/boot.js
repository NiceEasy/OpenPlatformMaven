/**
 * @author 田鑫龙
 */
var boot = {
    isDate : function(value) {
        return !!(value && value.getTime);
    },
    isArray : function(value) {
        return !!(value && !!value.push);
    },
    isNull : function(value) {
        return value === null || value === undefined;
    },

    isNumber : function(value) {
        return !isNaN(value) && typeof value == 'number';
    },
    formatDate : function(format, time, returnDate) {
        if (time == undefined || time == '') {
            return "";
        }
        if (jQuery.type(time) == 'string') {
            if(format.toLowerCase() == 'yyyy-mm-dd hh'){
                if(/^\d{2,4}.{1,1}\d{2,2}.{1,1}\d{2,2}\s*\d{2,2}$/.test(time))
                    time += ':00';
            }
            if(format.toLowerCase() == 'hh' || format.toLowerCase() == 'hh:mi' || format.toLowerCase() == 'hh:mi:ss'){
                time = this.formatDate('yyyy-mm-dd ', new Date()) + time;
            }
            time = time.replace(/-/g, "/");
            time = time.replace(/T/i, " ");
            time = new Date(time);
            if(returnDate){
                return time;
            }
        }
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        format = format.replace(/YYYY/i, time.getFullYear());
        format = format.replace(/YY/i, (time.getYear() % 100) > 9 ? (time.getYear() % 100).toString() : '0' + (time.getYear() % 100));
        format = format.replace(/MM/i, (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1));
        format = format.replace(/W/g, Week[time.getDay()]);
        format = format.replace(/DD/i, time.getDate() > 9 ? time.getDate().toString() : '0' + time.getDate());
        format = format.replace(/HH/i, time.getHours() > 9 ? time.getHours().toString() : '0' + time.getHours());
        format = format.replace(/MI/i, time.getMinutes() > 9 ? time.getMinutes().toString() : '0' + time.getMinutes());
        format = format.replace(/SS/i, time.getSeconds() > 9 ? time.getSeconds().toString() : '0' + time.getSeconds());
        return format;
    }
};
/*------------类继承--------------*/
//TODO extend 类继承
boot.extend = function(subFun, superFun, prototype) {
    var superClass = function() {
    };
    superClass.prototype = superFun.prototype;

    superClass.constructor = superFun.constructor;
    superClass.prototype.constructor = superFun;
    subFun.prototype = new superClass();
    subFun.prototype.constructor = subFun;
    if (prototype) {
        for (var key in prototype) {
            subFun.prototype[key] = prototype[key];
        }
    }
    subFun.superClass = superFun.prototype;
    //如果父类superclass.prototype.constructor没有被自定义，则自定义
    if (superFun.prototype.constructor == Object.prototype.constructor) {
        superFun.prototype.constructor = superFun;
    }
};

/*--------------newId----------------*/
//TODO 产生唯一ID
boot._index = 0;
boot.newId = function(prefix) {
    prefix = prefix || 'boot';
    var id = prefix + '-' + this._index++;
    return id;
};
boot._uuid = boot.newId();

/*------------------组建寄存器---------------------*/
//TODO Deposit
boot.components = {};
boot.bindings = {};
boot.Deposit = function(id, comp) {
    var storage = boot.components;
    if (boot.Binding && comp instanceof boot.Binding) {
        storage = boot.bindings;
    }
    if (!storage[id]) {
        storage[id] = comp;
    } else {
        alert('id 只能注册一次!');
    }
};

/*------------------组建销毁--------------------*/
boot.Destroy = function(id) {
    if (this.components[id]) {
        delete this.components[id];
    } else if (this.bindings[id]) {
        delete this.bindings[id];
    }
};

/*------------------注册中心---------------------*/
//TODO register
boot.registers = {};
boot.Register = function(bean, uiType) {
    if (!this.registers[uiType]) {
        this.registers[uiType] = bean;
        bean.prototype.type = uiType;
    } else {
        alert('uiType 只能注册一次!');
    }
};

/*-------------------通过id属性提取注册的组件--------------------*/
//TODO get
boot.get = function(id) {
    if (this.components[id]) {
        return this.components[id];
    } else if (this.bindings[id]) {
        return this.bindings[id];
    }
};

/*-------------------通过name属性提取注册的组件--------------------*/
//TODO get
boot.getByName = function(name, parent) {
    var rs = boot.components;
    if (parent) {
        var _uuid = parent._uuid;
        rs = boot.relationship[_uuid] || [];
    }
    for (var index in rs) {
        var comp = rs[index];
        if (comp.name == name) {
            return comp;
        }
    }
};

/*-------------------html转换成组件--------------------*/
//TODO parse
boot.parse = function(id) {
    if (id) {
        var jQel = jQuery('#' + id);
        if (jQel[0]) {
            boot.__parse(jQel[0]);
        }
    } else {
        if (this._firstParse !== true) {
            boot._firstParse = true;
            var els = jQuery('*[class*="boot-"]');
            els.each(function(index, el) {
                boot.__parse(el);
            });
            els = null;
        }
    }

};
boot.__parse = function(el) {
    var id = el.id;
    if (id != undefined && id != '') {
        if (boot.get(id)) {
            return false;
        }
    }
    var allCls = el.className || "";
    var clses = allCls.split(' ');
    for (var i = 0, length = clses.length; i < length; i++) {
        var cls = clses[i];
        var uiCls = cls.replace('boot-', '');
        if (/boot-/.test(cls) && boot.registers[uiCls]) {
            var bean = boot.registers[uiCls];
            if (id == '' || id == undefined) {
                id = boot.newId();
                el.id = id;
            }
            var instance = new bean(jQuery(el));
            boot.Deposit(id, instance);
            break;
        }
    }
};

/*--------------通过父元素转换子元素组件---------------*/
boot.parseByParent = function(parent) {
    var els = jQuery('*[class*="boot-"]', parent);
    els.each(function(index, el) {
        boot.__parse(el);
    });

};
/*-------------------ajax异步请求--------------------*/
//TODO ajax
boot.ajax = function(options) {
    var _default = {
        dataType : 'json',
        timeout : 120000,
        success : function(result) {
            alert(result.message);
        },
        error : function(e) {
            console.log(e);
        }
    };
    _default = jQuery.extend(true, _default, options);
    //ajax的请求永远被默认为post请求和无缓存
    _default.type = 'post';
    _default.cache = false;
    //ajax的beforeSend事件，返回false阻止ajax运行
    if (_default.before && jQuery.type(_default.before) === 'function') {
        _default.beforeSend = options.before;
        delete _default.before;
    }
    //ajax的完成事件，无论请求结果怎样都会执行
    if (_default.after && jQuery.type(_default.before) === 'function') {
        _default.complete = options.after;
        delete _default.after;
    }
    jQuery.ajax(_default);
};

/*------------克隆数据---------------*/
boot.clone = function(target) {
    return eval("(" + JSON.stringify(target) + ")");
};

/*----------------------------------------------*/
//TODO object对象的属性添加前缀
boot.addPrefix = function(data, prefix) {
    var result = {};
    if (jQuery.type(data) == 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            var row = data[i];
            for (var key in row) {
                result[prefix + "[" + i + "]." + key] = row[key];
            }
        }
    } else {
        if (prefix == undefined) {
            prefix = "";
        } else {
            prefix = prefix + ".";
        }
        for (var key in data) {
            result[prefix + key] = data[key];
        }
    }
    return result;
};

/**---------------------遮蔽层-------------------------**/

boot.Modal = function(parent) {
    this.id = boot.newId();
    this._create(parent);
};

boot.Modal.prototype = {
    _create : function(parent) {
        this.el = jQuery('<div id="' + this.id + '" class="boot-modal" style="display: none;"></div>');
        this.bgEl = jQuery('<div class="modal-background"></div>');
        this.textEl = jQuery('<div class="modal-text modal-loading"></div>');

        this.bgEl.appendTo(this.el);
        this.textEl.appendTo(this.el);

        if ( parent instanceof jQuery) {
            this.el.appendTo(parent);
        } else {
            parent.appendChild(this.el[0]);
        }
    },
    _show : function() {
        this.el.show();
        this._update();
    },
    _hide : function() {
        this.el.hide();
    },
    _setText : function(text) {
        this.textEl.text(text);
    },
    _update : function() {
        var width = this.textEl.outerWidth();
        var height = this.textEl.outerHeight();
        this.textEl.css({
            "margin-left" : -width / 2,
            "margin-top" : -height / 2
        });
    }
};

/*----------------------合并对象的方法----------------------------*/
//对象的合并方法，支持无限参数合并到第一个对象

boot.concat = function() {
    var concat = function(source, target) {
        for (var key in target) {
            var value = target[key];
            if (jQuery.type(value) == "array") {
                var sourceValue = source[key] = source[key] || [];
                concat(sourceValue, value);
            } else if (jQuery.type(value) == "object") {
                var sourceValue = source[key] = source[key] || {};
                concat(sourceValue, value);
            } else {
                if (jQuery.type(source) == "array") {
                    source.push(value);
                } else {
                    source[key] = value;
                }
            }
        }
        return source;
    };

    try {
        if (arguments.length === 0) {
            throw "没有足够的参数!";
        }
        if (arguments.length === 1) {
            throw "没有足够的参数,请输入两个或以上参数!";
        }
        var subObject = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var targetObject = arguments[i];
            concat(subObject, targetObject);
        }
        return subObject;
    } catch (ex) {
        alert(ex);
        console.error(ex);
    }
};

/**-------------------查找子元素----------------------**/
//记录各个组件之间的关系，例如：form下的各种组件
boot.relationship = {};
boot.findChildComponents = function() {
    var me = this;
    // window.setTimeout(function() {
    var controls = [];
    for (var key in boot.components) {
        var component = boot.components[key];
        var el = component.el;
        var parent = el.parents("#" + me.id);
        if (parent[0] != undefined) {
            controls.push(component);
        }
    }
    boot.relationship[me._uuid] = controls;
    // }, 0);
};

/*----------------转换属性-----------------*/
//TODO 转换属性
boot._getBasicAttrs = function(el, attrs) {
    attrs = attrs || {};
    var num = boot._parseNumber(el, attrs.number || []);
    var str = boot._parseString(el, attrs.str || []);
    var bool = boot._parseBool(el, attrs.bool || []);
    var json = boot._parseJSON(el, attrs.json || []);

    var o = {};
    o = boot.concat(o, str, bool, num, json);
    return o;
};
boot._parseString = function(el, attrs) {
    return this._parseProperty(el, attrs, "string");
};
boot._parseBool = function(el, attrs) {
    return this._parseProperty(el, attrs, "boolean");
};
boot._parseNumber = function(el, attrs) {
    return this._parseProperty(el, attrs, "number");
};
boot._parseEvent = function(el, attrs) {
    return this._parseProperty(el, attrs, "event");
};
boot._parseJSON = function(el, attrs) {
    return this._parseProperty(el, attrs, "json");
};
boot._parseProperty = function(el, attrs, type) {
    var config = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
        var property = attrs[i];
        var value = el.attr(property);
        if (value) {
            switch(type) {
            case 'string':
                config[property] = value;
                break;
            case 'boolean':
                config[property] = (value == "true" || value === property) ? true : false;
                break;
            case 'json':
                config[property] = eval("(" + value + ")");
                break;
            case 'number':
                config[property] = Number(value.replace(/px/i, ""));
                break;
            case 'event':
                config[property] = (function(_fn) {
                    return function(e) {
                        var fn = eval(_fn);
                        if (jQuery.type(fn) == 'function') {
                            return fn.call(this, e);
                        }
                    };
                })(value);
                break;
            }
            el.removeAttr(property);
        }
    }
    return config;
};
/************HTML处理器**************/
boot.HTML = function(html) {
    this.array = [];
    this.push(html);
};
boot.HTML.prototype = {
    push : function(html) {
        if (html && html != '') {
            if ( html instanceof boot.HTML) {
                this.array = this.array.concat(html.array);
            } else if (jQuery.isArray(html)) {
                this.array = this.array.concat(html);
            } else {
                this.array.push(html);
            }
        }
    },
    concat : function(split) {
        split = split || "";
        return this.array.join(split);
    },
    empty : function() {
        this.array = [];
    },
    isEmpty : function() {
        return !Boolean(this.array.length);
    }
};

/*---------------Rooter-----------------*/
//TODO Rooter
boot.Rooter = function(el) {
    this.events = {};
    this._uuid = boot.newId();
    this._init(el);
    this._getAttrs();
    this._initField();
    this._create();
    this._resetProperty();
    this._getBox();
    this._bindEvents();
    this._documentEvent();
};

boot.Rooter.prototype = {
    uiCls : "",
    _initField : function() {
    },
    _create : function() {

    },
    _resetProperty : function() {
        //还原id属性
        this.el.attr("id", this.id);
        this.el.addClass(this.uiCls);
        this.el.addClass(this['class']);
        var style = this.el.attr("style") || "";
        if (style != "") {
            style += ";" + (this.style || "");
        } else {
            style = this.style || "";
        }
        if (style != "")
            this.el.attr("style", style);
    },
    _init : function(el) {
        if (jQuery.type(el) === 'string') {
            this.id = el;
            this.el = jQuery('#' + this.id);
        } else {
            this.el = el;
            this.id = el[0].id;
        }
    },
    //el支持dom元素和jQuery对象, 此方法是用来获取dom元素的位置信息包括offset和width、height
    _getBox : function(el) {
        el = el || this.el;
        if (el) {
            if (/HTML\w+ELEMENT/.test(el.constructor.name)) {
                el = jQuery(el);
            } else if (el.isControl) {
                el = jQuery(el.el);
            }
        }
        var box = el.offset();
        box.width = el.outerWidth();
        box.height = el.outerHeight();
        return box;
    },
    _triggerHandler : function(e) {
        var event = new boot.Event(e);
        event._execute();
    },
    _on : function(el, selector, eventType, fn, sender) {
        var ev = {
            sender : sender || this,
            handler : fn,
            eventType : eventType
        };
        el.delegate(selector, eventType, ev, this._triggerHandler);
    },
    _bindEvents : function() {

    },
    _bind : function(type, fn, scope) {
        scope = scope || this;
        type = type.toLowerCase();
        if (/^on/.test(type) == false)
            type = "on" + type;
        var handlers = this.events[type] = this.events[type] || [];
        handlers.push([fn, scope]);
    },
    //触发通过bind方法或属性自定义方法绑定的数据
    _fire : function(type, ev) {
        if (!/^on/.test(type)) {
            type = "on" + type;
        }
        var events = this.events[type] || [];
        for (var i = 0, length = events.length; i < length; i++) {
            var event = events[i];
            event[0].call(event[1], ev);
        }
    },
    _evalEvents : function(fns) {
        for (var type in fns) {
            this._bind(type, fns[type], this);
        }
    },
    _documentEvent : function() {
        var me = this;
        jQuery(document.body).on('click', function(e) {
            var event = new boot.Event(e);
            event._execute();
            me._fire('onbodyclick', event);
        });
    },
    _getAttrs : function(attrs) {
        attrs = boot.concat({
            str : ["id", "class", "style"],
            json : ["customOptions"]
        }, attrs || {});
        var str = boot._parseString(this.el, attrs.str || []);
        var bool = boot._parseBool(this.el, attrs.bool || []);
        var json = boot._parseJSON(this.el, attrs.json || []);
        var num = boot._parseNumber(this.el, attrs.number || []);
        var fn = boot._parseEvent(this.el, attrs.fn || []);
        this._evalEvents(fn);

        var o = {};
        o = boot.concat(o, str, bool, num, json);
        boot.concat(this, o);
        o = boot.concat(o, fn);
        return o;
    },
    //API
    bind : function(type, fn, scope) {
        this._bind(type, fn, scope);
    }
};

/*---------------Event-----------------*/
//TODO Event
boot.Event = function(e, options) {
    this.event = e.originalEvent || e;
    this.jQueryEvent = e;
    this.target = jQuery(e.target);
    this.selector = jQuery(e.currentTarget);
    this._appendOptions(boot.concat(e.data, options || {}));
};

boot.Event.prototype = {
    _execute : function() {
        if (this.handler)
            this.handler.call(this.sender, this);
    },
    _appendOptions : function(options) {
        for (var key in options) {
            this[key] = options[key];
        }
    },
    preventDefault : function() {
        this.jQueryEvent.preventDefault();
    },
    stopPropagation : function() {
        this.jQueryEvent.stopPropagation();
    }
};

/**---------------dialog------------------------**/
//弹出窗口
boot.dialog = function(options) {
    return new boot.Window(options);
};

/***************************************************************************/
//TODO Drag类
/**
 * @discription: 拖拽功能，将需要拖拽的组件调用Drag组件，传入响应鼠标事件的元素和要移动的元素
 *
 **/
var Drag = function(respondEl, moveEl) {
    this.hover = false;
    this.offset = {};
    this.temp = jQuery("<div>", {
        'class' : 'boot-drag-temp'
    });
    this.leaveOffset = {
        top : 0,
        left : 0
    };
    this.current = undefined;
    this.init(respondEl, moveEl);
};

Drag.prototype = {
    init : function(respondEl, moveEl) {
        this.mouseup(respondEl, moveEl);
        this.mousemove(respondEl, moveEl);
        this.mouseon(respondEl);
        this.mouseleave(respondEl);
        this.mousedown(respondEl);
        this.temp.appendTo(document.body);
    },
    mouseon : function(respondEl) {
        var me = this;
        respondEl.mouseenter(function(e) {
            me.hover = true;
        });
    },
    mouseleave : function(respondEl) {
        var me = this;
        respondEl.mouseleave(function(e) {
            me.hover = false;
        });
    },
    mousedown : function(respondEl) {
        var me = this;
        respondEl.mousedown(function(e) {
            if (me.hover) {
                me.allowDrag = true;
                var self = jQuery(this);
                self.addClass("panel-drag");
                var offset = self.offset();
                me.offset = {
                    top : offset.top - e.pageY,
                    left : offset.left - e.pageX
                };
            }
        });
    },
    mouseup : function(respondEl, moveEl) {
        var me = this;
        me.temp.mouseup(function(e) {
            me.allowDrag = false;
            jQuery(this).removeClass("panel-drag");
            me.current.css(me.temp.offset()).show();
            me.temp.hide();
        });
        respondEl.mouseup(function(e) {
            if (me.hover) {
                me.allowDrag = false;
                jQuery(this).removeClass("panel-drag");
            }
        });
    },
    mousemove : function(respondEl, moveEl) {
        var me = this;
        respondEl.on('mousemove', {
            moveEl : moveEl
        }, function(e) {
            if (me.allowDrag) {
                var mel = e.data.moveEl;
                var offset = mel.offset();
                me.current = mel;
                me.temp.show().css({
                    width : mel.width(),
                    height : mel.height(),
                    top : offset.top,
                    left : offset.left
                });
                mel.hide();
            }
        });
        jQuery(document.body).mousemove(function(e) {
            if (me.allowDrag) {
                var top = e.pageY + me.offset.top;
                var left = e.pageX + me.offset.left;
                me.temp.css({
                    top : top >= 0 ? top : 0,
                    left : left >= 0 ? left : 0
                });
            }
        });
    }
};
/**-----------------vType----------------------**/
//TODO
boot.VTypes = {
    required : function(v, args) {
        if (boot.isNull(v) || v === "")
            return true;
        return false;
    },
    email : function(v) {
        if (this.required(v))
            return true;
        if (v.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
            return true;
        else
            return false;
    },
    url : function(v) {
        if (this.required(v))
            return true;
        function IsURL(str_url) {
            str_url = str_url.toLowerCase().split("?")[0];
            var strRegex = "^((https|http|ftp|rtsp|mms)?:\/\/)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|" + "([0-9a-z_!~*'()-]+\.)*" + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,5})?" + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);

            if (re.test(str_url)) {
                return (true);
            } else {
                return (false);
            }
        }

        return IsURL(v);
    },
    "int" : function(v) {
        if (this.required(v))
            return true;
        function isInteger(s) {
            if (s < 0) {
                s = -s;
            }
            var n = String(s);
            return n.length > 0 && !(/[^0-9]/).test(n);
        }

        return isInteger(v);
    },
    "float" : function(v) {
        if (this.required(v))
            return true;
        function isFloat(s) {
            if (s < 0) {
                s = -s;
            }
            var n = String(s);
            if (n.split(".").length > 2)
                return false;
            return n.length > 0 && !(/[^0-9.]/).test(n);
        }

        return isFloat(v);
    },
    date : function(v, args) {
        if (this.required(v))
            return true;
        if (!v)
            return false;
        var d = null;
        var format = args[0];

        if (format) {
            d = boot.parseDate(v, format);
            if (d && d.getFullYear) {
                if (boot.formatDate(d, format) == v)
                    return true;
            }
        } else {
            d = boot.parseDate(v, "yyyy-MM-dd");
            if (!d)
                d = boot.parseDate(v, "yyyy/MM/dd");
            if (!d)
                d = boot.parseDate(v, "MM/dd/yyyy");
            if (d && d.getFullYear)
                return true;
        }

        return false;
    }
};

boot.showTip = function(message) {
    alert(message);
};
/**---------------------------------------**/
jQuery(function() {
    boot.parse();
    console.info("parse");
});
