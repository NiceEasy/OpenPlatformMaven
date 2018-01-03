/**
 * @author 田鑫龙
 */
boot.DataGrid = function(id) {
    this.showIndex = true;
    this.showSelectBox = false;
    this.multiSelect = true;
    this.autoLoad = true;
    this.allowEdit = true;
    this.allowUpdate = true;
    this.allowRemove = true;
    this.autoAdapt = false;
    boot.DataGrid.superClass.constructor.call(this, id);
    this._createLock();
    this._createFreedom();
    this._createPager();
    this._createModal();
    this._bindAfterEvents();
    this._renderGridThead();
    this._doDataRequest();
    var me = this;
    $(window).resize(function() {
        me._adaptive();
        me._resize();
    });
};

boot.extend(boot.DataGrid, boot.Panel, {
    uiCls : "boot-datagrid",
    type : "grid",
    _initField : function() {
        this.showFoot = this.showPager;
        this.idField = this.idField || "id";
        this.pageIndex = this.pageIndex || 1;
        this.pageSize = this.pageSize || 20;
        this.parameters = this.parameters || {};
        this.queryMethod = this.queryMethod || "queryList.action";
        this.createMethod = this.createMethod || "create.action";
        this.saveMethod = this.saveMethod || "save.action";
        this.removeMethod = this.removeMethod || "delete.action";
        this.mergeColumns = {};
        this.mergeArray = [];
        this.skip = 1;
        this.totalPage = 0;
        //总页数
        this.total = 0;
        //总条数
        this.activedRow = undefined;
        this.savePrefix = this.savePrefix || "detailBeans";
        this.delPrefix = this.delPrefix || "delBeans";
        this.data = this.data || [];
        this.cacheRows = [];
    },
    _init : function(el) {
        this.el = el;
        this.id = el[0].id;
    },
    _create : function() {
        boot.DataGrid.superClass._create.call(this);
        this.el.addClass("boot-panel");
        this.el.css("position", "relative");
        this.bodyEl.css({
            'overflow' : 'hidden'
        });
    },
    //自适应
    _adaptive : function() {
        if (this.autoAdapt) {
            var siblings = this.el.siblings().toArray();
            var parent = this.el.parent();
            parent.css('overflow', "hidden");
            var height = 0, winHeight = this.el.parent().height();
            for (var i = 0, len = siblings.length; i < len; i++) {
                var el = siblings[i];
                var tagName = el.tagName.toLowerCase();
                if (tagName == "style" || tagName == "script")
                    continue;
                var pos = el.style.position;
                if (pos == "absolute" || pos == "fixed")
                    continue;
                var jEl = jQuery(el);
                height += jEl.outerHeight();
            }
            this._setHeight(winHeight - height);
        }
    },
    _createLock : function() {
        var lockEl = jQuery('<div class="datagrid-lock"></div>');

        var lockHeadBorderEl = jQuery('<div class="datagrid-head"></div>');
        var lockHeadEl = jQuery('<table class="datagrid-table-head" cellpadding="0" cellspacing="0"></table>');
        lockHeadEl.appendTo(lockHeadBorderEl);

        var lockViewBorderEl = jQuery('<div class="datagrid-view datagrid-view-lock"></div>');
        var lockViewEl = jQuery('<table class="datagrid-table-view" cellpadding="0" cellspacing="0" style="margin-bottom: 26px;"><tbody></tbody></table>');
        lockViewEl.appendTo(lockViewBorderEl);
        var lockViewBodyEl = lockViewEl.children('tbody');

        lockHeadBorderEl.appendTo(lockEl);
        lockViewBorderEl.appendTo(lockEl);

        this.lockEl = lockEl;
        this.lockHeadEl = lockHeadEl;
        this.lockHeadBorderEl = lockHeadBorderEl;

        this.lockViewEl = lockViewEl;
        this.lockViewBorderEl = lockViewBorderEl;
        this.lockViewBodyEl = lockViewBodyEl;

        this.bodyEl.append(this.lockEl);
    },
    _createFreedom : function() {
        var freedomEl = jQuery('<div class="datagrid-freedom"></div>');

        var freedomHeadBorderEl = jQuery('<div class="datagrid-head"></div>');
        var freedomHeadEl = jQuery('<table class="datagrid-table-head" cellpadding="0" cellspacing="0"></table>');
        freedomHeadEl.appendTo(freedomHeadBorderEl);

        var freedomViewBorderEl = jQuery('<div class="datagrid-view datagrid-view-lock"></div>');
        var freedomViewEl = jQuery('<table class="datagrid-table-view" cellpadding="0" cellspacing="0"><tbody></tbody></table>');
        freedomViewEl.appendTo(freedomViewBorderEl);
        var freedomViewBodyEl = freedomViewEl.children('tbody');

        freedomHeadBorderEl.appendTo(freedomEl);
        freedomViewBorderEl.appendTo(freedomEl);

        this.freedomEl = freedomEl;
        this.freedomHeadEl = freedomHeadEl;
        this.freedomHeadBorderEl = freedomHeadBorderEl;

        this.freedomViewEl = freedomViewEl;
        this.freedomViewBorderEl = freedomViewBorderEl;
        this.freedomViewBodyEl = freedomViewBodyEl;

        this.bodyEl.append(this.freedomEl);
    },
    _createPager : function() {
        var pagerId = boot.newId();
        this.footEl.append('<div id="' + pagerId + '" class="boot-pager" style="width: 100%;height: 100%;"></div>');
        boot.parse(pagerId);
        this.pager = boot.get(pagerId);

        this.pager._setSizeList(this.sizeList || [20, 50, 100, 1000]);
        this.pager._setPageSize(this.pageSize);

        this.pager._buttonEventRegister(function(sender, empty) {
            this.pagerEvents.skipEvent = function(e) {
                var oldValue = e.sender.getValue();
                var newValue = e.sender.textEl.val();
                if (newValue > sender.totalPage) {
                    sender.pageIndex = oldValue;
                    e.sender.setValue(oldValue);
                } else {
                    sender.pageIndex = newValue;
                    sender._reload();
                }

            };
            this.pagerEvents.sizeEvent = function(e) {
                var value = e.sender.value;
                if (value > sender.total || Math.ceil(sender.total / value) > sender.skip) {
                    sender.pageIndex = 1;
                }
                sender.pageSize = value;
                sender._reload();
            };
            this.pagerEvents.reloadEvent = function(e) {
                this.skipEl.setValue(sender.pageIndex);
                sender._reload();
            };
            this.pagerEvents.prevEvent = function(e) {
                if (sender.pageIndex <= 1) {
                    return false;
                }
                sender.pageIndex -= 1;
                sender.parameters.pageIndex = sender.pageIndex;
                sender._reload();
            };
            this.pagerEvents.nextEvent = function(e) {
                if (sender.pageIndex >= sender.totalPage) {
                    return false;
                }
                sender.pageIndex += 1;
                sender.parameters.pageIndex = sender.pageIndex;
                sender._reload();
            };
            this.pagerEvents.firstEvent = function(e) {
                if (sender.pageIndex == 1) {
                    return false;
                }
                sender.pageIndex = 1;
                sender.parameters.pageIndex = sender.pageIndex;
                sender._reload();
            };
            this.pagerEvents.lastEvent = function(e) {
                if (sender.pageIndex == sender.totalPage) {
                    return false;
                }
                sender.pageIndex = sender.totalPage;
                sender.parameters.pageIndex = sender.pageIndex;
                sender._reload();
            };
        }, this);
    },
    _createModal : function() {
        this.modal = new boot.Modal(this.el);
        this.modal._setText("加载中...");
    },
    _getParameters : function() {
        return this.parameters;
    },
    _setParameters : function(params) {
        this.parameters = params;
    },
    _formatParameters : function(data) {
        var result = {}, index = 0;
        function getType(type) {
            switch(type) {
            case 'string':
                return "java.lang.String";
            case 'number':
                return "java.lang.Integer";
            }
        }

        function format(object) {
            for (var name in object) {
                var value = object[name];
                result['params[' + index + '].value'] = value;
                result['params[' + index + '].name'] = name;
                result['params[' + index + '].type'] = getType(jQuery.type(value));
                index++;
            }
        }

        format(this.parameters);
        if (jQuery.type(data) == 'array') {
            for (var i = 0, len = data.length; i < len; i++) {
                format(data[i]);
            }
        } else {
            format(data);
        }
        result['pageIndex'] = this.pageIndex;
        result['pageSize'] = this.pageSize;
        result['sortField'] = this.sortField;
        result['sortOrder'] = this.sortOrder;
        return result;
    },
    _queryMethod : function(options) {
        this.currentAction = "query";
        this._load(options);
    },
    _doDataRequest : function() {
        if (this.autoLoad) {
            this._queryMethod();
        }
    },
    __save: function(){},
    __update: function(){},
    __remove: function(array){
        if(this.beforeRemove){
            var result = this.beforeRemove.call(this, {
                sender : this,
                rows : array
            });
            if (jQuery.type(result) == 'boolean' && result == false) {
                return result;
            }
        }
        var options = {
            data: boot.addPrefix(array, "delBeans"),
            url: this.action + "_" + this.removeMethod,
            context: this,
            success: function(result){
                if(result.success){
                    alert("删除成功!");
                }
                var e = {
                    sender: this,
                    row: row,
                    success: result.success
                };
                this._fire('onrowremove', e);
                this._reload();
            }
        };
        boot.ajax(options);
    },
    _reload : function() {
        this.skip = this.pageIndex;
        this.pager.skipEl.setValue(this.skip);
        this._queryMethod();
    },
    //获取url
    _getUrl : function(url) {
        return url || (this.action ? (this.action + "_" + this.queryMethod) : this.url);
    },
    //加载数据方法
    _load : function(url, fn) {
        this.modal._show();
        this._callback = fn;
        var options = {
            success : this._loadSuccess,
            context : this
        };
        if (jQuery.type(url) === "string") {
            options.url = url;
        } else {
            boot.concat(options, url);
        }
        options.url = this._getUrl(options.url);
        options.data = this._formatParameters(options.data || {});
        if (options.url)
            boot.ajax(options);
    },
    _loadSuccess : function(result) {
        if (result.success) {
            var resultData = result.resultData;
            this.total = resultData.total;
            this._loadData(resultData.data);
        }
    },
    _loadData : function(result) {
        var e = {
            sender : this,
            result : result
        };
        this._fire('onbeforerender', e);
        
        this.data = result;
        this._renderGridView();
        this._updatePagerData();
        this._adaptive();
        this._resize();
        
        if (this._callback) {
            this._callback.call(this, e);
            delete this._callback;
        }
        this._fire('onloadsuccess', e);

        if (this.cacheRow) {
            this._checkRows(this.cacheRows);
        }
        this._mergeCells();
        this._checkTotalCheckBox();
        this.modal._hide();
    },
    _renderGridThead : function() {
        var lockWidth = 0;
        var colspan = 0;
        var columns = this.columns;
        var lockHtml = ["<thead><tr>"], freedomHtml = ["<thead><tr>"];
        for (var i = 0, len = columns.length; i < len; i++) {
            var column = columns[i];
            if (column.show) {
                column.width = column.width || 100;
                var td = '<td style="width: ' + column.width + 'px;">' + column._renderHead() + '</td>';
                if (column.locked) {
                    lockWidth += column.width + 1;
                    lockHtml.push(td);
                    colspan++;
                } else {
                    freedomHtml.push(td);
                }
            }
        }
        lockHtml.push('</tr></thead>');
        freedomHtml.push("</tr></thead>");

        this.lockEl.css('width', (lockWidth + 1) + 'px');
        this.freedomEl.css("margin-left", lockWidth + 'px');

        this.lockHeadEl.append(lockHtml.join(""));
        this.freedomHeadEl.append(freedomHtml.join(""));

        this._hideHeadToView();
    },
    _renderGridView : function(data) {
        this.lockViewBodyEl.empty();
        this.freedomViewBodyEl.empty();
        data = data || this.data;
        var lockHtml = [], freedomHtml = [];
        var columns = this.columns;
        for (var index = 0, len = data.length; index < len; index++) {
            var row = data[index];
            this._addRow(row, index);
        }
    },
    _addRowIdentify : function(row, object) {
        boot.concat(row, object);
        //添加唯一标识
        row._uuid = boot.newId();
        row._allowEdit = row._allowEdit !== undefined ? row._allowEdit : true;
        row._allowCheck = row._allowCheck !== undefined ? row._allowCheck : true;
        // 添加未选择标识
        row._checked = row._checked !== undefined ? row._checked : false;
        //实际行号
        row._num = this.pageSize * (this.pageIndex - 1) + row._index + 1;

        return row;
    },
    _addRow : function(row, index) {

        row = this._addRowIdentify(row, {
            _index : index
        });
        
        var evenCls = "odd";
        if(index % 2 === 1){
            evenCls = "even";
        }

        var columns = this.columns, lock = '<tr id="' + row._uuid + '$row$lock" class="'+ evenCls +'">', freedom = '<tr id="' + row._uuid + '$row$freedom" class="'+ evenCls +'">';
        for (var i = 0, length = columns.length; i < length; i++) {
            var column = columns[i];
            var html = this._renderTD(row, column);
            if (column.locked) {
                lock += html;
            } else {
                freedom += html;
            }
        }
        lock += '</tr>', freedom += '</tr>';
        this.lockViewBodyEl.append(lock);
        this.freedomViewBodyEl.append(freedom);
        return {
            locked : lock,
            freedom : freedom
        };
    },
    _getMergeCell : function(flag) {
        var len = this.mergeArray.length;
        if (len == 0 || flag) {
            this.mergeArray[len] = {};
            len++;
        }
        return this.mergeArray[len - 1];
    },
    //渲染TD//TODO
    _renderTD : function(row, column) {
        var visible = column.show ? '' : 'hide';
        var id = row._uuid + '$cell$' + column._index;
        var value = row[column.field];
        if (column.merge) {
            var merge = this._getMergeCell();
            if (merge.value === value) {
                merge.rowspan++;
                return "";
            } else {
                if (!jQuery.isEmptyObject(merge))
                    merge = this._getMergeCell(true);
                merge.value = value;
                merge.id = id;
                merge.rowspan = Number(merge.rowspan || 0) + 1;
            }
        }
        var cell = "";
        if (row._editting && column._renderEditor) {
            cell += column._renderEditor(row, this);
            //TODO renderEditor
        } else {
            cell += column._renderCell(row, this);
            //TODO renderCell
        }
        return '<td id="' + id + '" class="' + visible + '">' + cell + '</td>';
    },
    //合并单元格
    _mergeCells : function() {
        for (var i = 0, len = this.mergeArray.length; i < len; i++) {
            var merge = this.mergeArray[i];
            var selector = merge.id.replace(/\$/g, "\\$");
            var td = jQuery('#' + selector, this.bodyEl);
            td.prop("rowspan", merge.rowspan);
        }
    },
    //api调用，有添加新增状态
    _addRows : function(rows, index) {
        if (index == undefined)
            index = this.data.length;
        if (jQuery.type(rows) == 'object') {
            rows = [rows];
        }
        for (var i = 0, length = rows.length; i < length; i++, index++) {
            var row = rows[i];
            row._status = "_add";
            this.data.push(row);
            this._addRow(row, index);
        }
        this._checkTotalCheckBox();
    },
    _hideHeadToView : function() {
        var lockHeadClone = this.lockHeadEl.children().clone();
        var freedomHeadClone = this.freedomHeadEl.children().clone();

        lockHeadClone.find("td").empty().height(0);
        freedomHeadClone.find("td").empty().height(0);

        lockHeadClone.find(":checkbox,:radio").remove();

        this.lockViewEl.prepend(lockHeadClone);
        this.freedomViewEl.prepend(freedomHeadClone);
    },
    _updatePagerData : function() {
        this.pager.total = this.total;
        this.totalPage = Math.ceil(this.total / this.pageSize);
        this.pager.totalEl.html(" / " + this.totalPage);
        this.pager.infoEl.html("每页 " + this.pageSize + " 条,共 " + this.total + " 条");
    },
    //为freedom表头补白
    _resize : function() {
        if (this.freedomViewEl.height() > this.freedomViewBorderEl.height()) {
            this.freedomHeadBorderEl.width(this.freedomViewBorderEl.width() - 17);
            this.freedomEl.addClass("fixed");
        } else {
            this.freedomHeadBorderEl.width(this.freedomViewBorderEl.width());
            this.freedomEl.removeClass("fixed");
        }
    },
    _bindAfterEvents : function() {
        this._on(this.bodyEl, ".grid-sort", 'click', this._onSortHeadClick, this);
        this._on(this.bodyEl, ":text", 'change', this._onEditorValueChanged, this);
        this._on(this.lockViewEl, "tr", 'click', this._onLockRowClick, this);
        this._on(this.freedomViewEl, "tr", 'click', this._onFreedomRowClick, this);
        this._on(this.lockViewEl, ":checkbox", 'click', this._onLockCheckboxClick, this);
        this._on(this.lockViewEl, ":radio", 'click', this._onLockRadioClick, this);
        this._on(this.lockHeadEl, ".boot-grid-button", 'click', this._onAddButtonClick, this);
        this._on(this.lockViewEl, ".boot-grid-button", 'click', this._onActionButtonClick, this);
        this._on(this.lockHeadEl, ":checkbox", 'click', this._checkAllCheckBox, this);
        this.freedomViewBorderEl.on("scroll", {
            sender : this
        }, this._onScrolling);
    },
    //排序功能触发
    _onSortHeadClick : function(e) {
        var el = e.selector;
        var ids = el.attr("id").split("$");
        var index = ids[2];
        var column = this.columns[index];
        if (column.sort == "") {
            column.sort = "asc";
        } else if (column.sort == "asc") {
            column.sort = "desc";
        } else {
            column.sort = "asc";
        }
        var json = {
            sort : column.sort
        };

        this['sortOrder'] = column.sort, this['sortField'] = column.field;
        this._load({}, function(e) {
            this._updateHead(column, json);
        });

    },
    //可编辑组件的value变更事件
    _onEditorValueChanged : function(e) {
        var el = e.selector;
        var id = el.attr('id');
        var editorId = id.replace('$text', '');
        var editor = boot.get(editorId);
        var options = editor.customOptions._parent;

        var row = this._getRowByUUID(options.rowUUID);
        row[options.field] = editor.getValue();
        row._status = row._status || '_update';

        var column = this.columns[options.columnIndex];
        //修改数据标识
        column._dirty = column._dirty || [];
        column._dirty.push(row._index);
        
        //验证
        column.error = column.error || [];
        if(!editor.validateValue){
            column.error.push(row._index);
        }

        e.editor = editor;
        e.column = column;
        e.row = row;
        this._fire('oncellvaluechanged', e);
    },
    //设置是否允许check
    _setAllowCheck : function(row, flag) {
        row._allowCheck = flag;
        row._checked = false;
        this._renderUpdateRow(row);
    },
    // 设置是否允许编辑行
    _setAllowEditRow : function(row, flag) {
        row._allowEdit = flag;
        row._editting = false;
        this.edittingRow = undefined;
        this._renderUpdateRow(row);
    },
    //控制按钮点击事件
    _onActionButtonClick : function(e) {
        var el = e.selector;
        var uuid = el.attr("uuid");
        var row = this._getRowByUUID(uuid);
        var action = el.attr("action");

        if (action == 'edit') {
            this._submitBeforeEditNext();
            row._editting = true;
            this._renderUpdateRow(row);
        } else if (action == 'submit') {
            row._editting = false;
            this._renderUpdateRow(row);
        } else {
            row._status = '_remove';
            this._renderUpdateRow(row);
            this.__remove([row]);//TODO
        }
        e.row = row;
        this._fire("on" + action + "row", e);
    },
    
    //add按钮点击事件
    _onAddButtonClick : function(e) {
        var el = e.selector;
        var uuid = el.attr("uuid");
        var rowIndex = this.data.length;

        var row = {
            _uuid : boot.newId(),
            _index : rowIndex,
            _status : '_add',
            _editting : true,
            _num : (this.pageIndex - 1) * this.pageSize + rowIndex
        };
        this._addRow(row, rowIndex);
        this.data.push(row);

        this._submitBeforeEditNext();
        this._renderUpdateRow(row);

        this._fire("onaddrow", e);
    },
    //编辑下一条前提交当前行
    _submitBeforeEditNext : function() {
        if (this.edittingRow) {
            var row = this.edittingRow;
            row._editting = false;
            this._renderUpdateRow(row);
            this.edittingRow = undefined;
        }
    },
    //重绘head单元格TODO
    _updateHead : function(column, json) {
        var selector = '#' + column._uuid + '\\$head\\$' + column._index;
        var cell = jQuery(selector, this.bodyEl);
        var th = cell.parent();
        column.text = json.text || column.text;
        column.sort = json.sort || column.sort;
        th.html(column._renderHead());
    },
    //渲染编辑器
    _renderUpdateRow : function(row) {
        var columns = this.columns;
        var lock = '', freedom = '';
        for (var i = 0, len = columns.length; i < len; i++) {
            var column = columns[i];
            //销毁组件
            boot.Destroy(column._uuid);
            var html = this._renderTD(row, column);
            if (column.locked) {
                lock += html;
            } else {
                freedom += html;
            }
        }

        var selector = '#' + row._uuid + '\\$row';
        var freedomEl = jQuery(selector + '\\$freedom', this.freedomViewEl);
        var lockEl = jQuery(selector + '\\$lock', this.lockViewEl);

        if (row._status == '_remove') {
            lockEl.remove();
            freedomEl.remove();
        } else {
            lockEl.html(lock);
            freedomEl.html(freedom);
        }
        if (row._editting) {
            boot.parseByParent(lockEl);
            boot.parseByParent(freedomEl);
        }
        this.edittingRow = row;
    },
    //锁定区域点击事件
    _onLockRowClick : function(e) {
        var el = e.selector;
        var id = el.attr("id").split("$")[0];
        var row = this._getRowByUUID(id);
        this._onRowclick(row);
        this._fire('onrowclick', e);
    },
    //自由区域点击事件
    _onFreedomRowClick : function(e) {
        var el = e.selector;
        var id = el.attr("id").split("$")[0];
        var row = this._getRowByUUID(id);
        this._onRowclick(row);
        this._fire('onrowclick', e);
    },
    _getRowByUUID : function(uuid) {
        for (var i = 0, len = this.data.length; i < len; i++) {
            var row = this.data[i];
            if (row._uuid == uuid) {
                return row;
            }
        }
    },
    //获取列
    _getColumn : function(field) {
        for (var i = 0, len = this.columns.length; i < len; i++) {
            var column = this.columns[i];
            if (column.field == field) {
                return column;
            }
        }
    },
    //获取编辑器
    _getEditorByName : function(field) {
        var column = this._getColumn(field);
        return boot.get(column._uuid);
    },
    //获取cacheRows缓存的数据，cacheRow属性为true生效
    _getCacheRows : function() {
        return this.cacheRows;
    },
    //接受锁定或自由区域点击处理
    _onRowclick : function(row) {
        var selector = '';
        if (this.activedRow) {
            selector = '#' + this.activedRow._uuid + '\\$row';
            jQuery(selector + '\\$freedom', this.freedomViewEl).removeClass("selected");
            jQuery(selector + '\\$lock', this.lockViewEl).removeClass("selected");
        }

        selector = '#' + row._uuid + '\\$row';
        jQuery(selector + '\\$freedom', this.freedomViewEl).addClass("selected");
        jQuery(selector + '\\$lock', this.lockViewEl).addClass("selected");

        this.activedRow = row;
    },
    //处理是否记录分页后的记录,选择行时，处理选择的数据
    _cacheRows : function(row) {
        if (this.cacheRow == true) {
            for (var index = 0, len = this.cacheRows.length; index < len; index++) {
                var record = this.cacheRows[index];
                if (record[this.idField] == row[this.idField]) {
                    this.cacheRows.splice(index, 1);
                    break;
                }
            }
            row["_checked"] && this.cacheRows.push(row);
        }
    },
    //根据rows记录中的key选择checkbox
    _checkRows : function(rows, key) {
        key = key || this.idField || "_uuid";
        var array = [];
        for (var i = 0, len = this.data.length; i < len; i++) {
            var record = this.data[i];
            for (var j = 0, length = rows.length; j < length; j++) {
                var row = rows[j];
                if (row[key] === record[key] && row._allowCheck !== false) {
                    var selector = '#' + record._uuid + '\\$selectbox';
                    jQuery(selector, this.bodyEl).prop('checked', true);
                    record["_checked"] = true;
                }
            }
        }
    },
    //radip点击事件
    _onLockRadioClick : function(e) {
        var el = e.selector;
        var id = el.attr("id").split("$")[0];
        var row = this._getRowByUUID(id);
        if (row._allowCheck !== false) {
            row["_checked"] = true;

            if (this.activedRow) {
                this.activedRow["_checked"] = false;
            }
            this._onRowclick(row);

            e.row = row;
            this._fire("onselect", e);
        }
    },
    //checkbox点击事件
    _onLockCheckboxClick : function(e) {
        var el = e.selector;
        var id = el.attr("id").split("$")[0];
        var row = this._getRowByUUID(id);
        if (row._allowCheck !== false) {
            row["_checked"] = !row["_checked"];

            this._cacheRows(row);

            this._checkTotalCheckBox();

            e.row = row;
            this._fire("onselect", e);
        }
    },
    //选择所有的checkbox使其处于选择状态或非选择状态
    _checkAllCheckBox : function(e) {
        var selector = e.selector;
        var _status = selector.prop("checked");
        var list = jQuery(":checkbox", this.lockViewEl);
        list.each(function(index) {
            var row = e.sender.data[index];
            if (row._allowCheck) {
                jQuery(this).prop('checked', _status);
                row["_checked"] = _status;
            }
        });

        this._fire("oncheckall", e);
    },
    //head的checkbox使其处于选择状态或非选择状态
    _checkTotalCheckBox : function() {
        var flag = true;
        for (var index = 0, len = this.data.length; index < len; index++) {
            var row = this.data[index];
            if (row._allowCheck)
                flag = flag && row["_checked"];
        }
        jQuery(":checkbox", this.lockHeadEl).prop("checked", flag);
    },
    //获取checkbox选中行
    _getSelectedRows : function() {
        var array = [];
        for (var index = 0, len = this.data.length; index < len; index++) {
            var row = this.data[index];
            if (row['_checked']) {
                array.push(row);
            }
        }
        return array;
    },
    _onScrolling : function(e) {
        var sender = e.data.sender;
        var top = jQuery(this).scrollTop();
        var left = jQuery(this).scrollLeft();
        sender.lockViewBorderEl.scrollTop(top);
        sender.freedomHeadBorderEl.scrollLeft(left);
    },
    //读取说有列，然后转换成列对象
    _readColumns : function() {
        var locked = [], freedom = [];
        locked.push(new boot.IndexColumn(this.showIndex));
        locked.push(new boot.SelectBoxColumn(this.showSelectBox, this.multiSelect));
        locked.push(new boot.ControlColumn(this.allowCellEdit, this.control));
        var columns = this.el.children().toArray();
        for (var i = 0, len = columns.length; i < len; i++) {
            var column = jQuery(columns[i]);
            var options = new boot.Column(column, this.allowCellEdit);
            // 为column添加序号
            options._index = i + 3;
            if (options.locked === true) {
                locked.push(options);
            } else {
                freedom.push(options);
            }
        }
        this.columns = locked.concat(freedom);
        this.el.empty();
    },
    _getAttrs : function(attributes) {
        var attrs = boot.concat({
            str : ["id", "idField", "action", "viewPage", "editPage", "queryMethod", "removeMethod", "url", "delPrefix", "savePrefix"],
            number : ["width", "height"],
            bool : ["showPager", "multiSelect", "autoLoad", "showSelectBox", "showIndex", "cacheRow", "allowCellEdit", "autoAdapt"],
            json : ["sizeList", "control"],
            fn : []
        }, attributes || {});
        var attr = boot.DataGrid.superClass._getAttrs.call(this, attrs);
        this._readColumns();
        return attr;
    },
    //获取操作过的行数据
    _getClassifiedData : function(type) {
        var data = this._getMixData();
        var changed = {
            '_add' : [],
            '_update' : [],
            '_remove' : []
        };
        for (var i = 0, len = data.length; i < len; i++) {
            var row = data[i];
            changed[row._status].push(row);
        }
        if (type) {
            return changed['_' + type];
        } else {
            return changed;
        }
    },
    //获取混合后的修改数据
    _getMixData : function() {
        var changed = [];
        for (var i = 0, len = this.data.length; i < len; i++) {
            var row = boot.clone(this.data[i]);
            var status = row._status;
            if (status)
                changed.push(row);
        }
        return changed;
    },

    //API
    getSelectedRow : function() {
        return this.activedRow;
    },
    getSelectedRows : function() {
        return this._getSelectedRows();
    },
    getActivedRow : function() {
        return this.activedRow;
    },
    reload : function() {
        this._reload();
    },
    loadData : function(data) {
        this._loadData(data);
    },
    getChangedData : function(type) {
        return this._getClassifiedData(type);
    },
    setParameters : function(param) {
        this._setParameters(param);
    },
    getRow : function(index) {
        var el = jQuery('tr:eq(' + index + ')', this.freedomViewBodyEl);
        var uuid = el.attr("id").split('$')[0];
        return this._getRowByUUID(uuid);
    },
    checkRows : function(rows, key) {
        this._checkRows(rows, key);
    },
    addRows : function(rows) {
        this._addRows(rows);
    },
    getData : function() {
        return this.data;
    },
    getColumn : function(field) {
        return this._getColumn(field);
    },
    updateHeadText : function(field, text) {
        var column = this.getColumn(field);
        this._updateHead(column, {
            "text" : text
        });
    },
    getEditorByName : function(field) {
        return this._getEditorByName(field);
    },
    getCacheRows : function() {
        return this._getCacheRows();
    },
    //设置是否允许check
    setAllowCheck : function(row, flag) {
        this._setAllowCheck(row, flag);
    },
    // 设置是否允许编辑行
    setAllowEditRow : function(row, flag) {
        this._setAllowEditRow(row, flag);
    },
    updateRow : function(node, row) {
        node = boot.concat(node, row);
        this._renderUpdateRow(node);
    }
});

boot.Register(boot.DataGrid, "datagrid");

/*------------------表格普通列对象-----------------------*/

boot.Column = function(el, allowEdit) {
    this._uuid = boot.newId();
    this.allowEdit = allowEdit;
    this.sort = '';
    this.show = true;
    this._getAttrs(el);
    this._init();
};

boot.Column.prototype = {
    _init : function() {
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
        return !result;
    },
    _renderCell : function(row, grid) {
        var dirty = row._status != undefined && jQuery.inArray(row._index, this._dirty || []) != -1 ? "dirty" : "";
        var value = row[this.field];
        if (this.editor && this.editor.data) {
            this.data = this.editor.data || [];
            var json = this._arrayToJson(this.editor.data);
            value = json[value];
        }
        if(this.editor && this.editor.format){
            this.format = this.editor.format || 'yyyy-mm-dd';
            value = boot.formatDate(this.editor.format, value);
        }
        value = value == undefined ? "" : value;
        //单元格渲染器，自定义渲染风格
        if (this.render) {
            var e = {
                row : row,
                column : this,
                cell : value
            };
            value = this.render(e);
        }
        var error = '', title = '';
        if(this.required){
            if(value == ''){
                error = 'error';
                title = '不能为空!';
            }
        }
        // if(vType)
        return '<div id="' + row._uuid + '$text" class="cell ' + dirty + '">' + value + '</div>';
    },
    _arrayToJson : function(array) {
        var json = {};
        for (var index in array) {
            var key = array[index]['id'];
            json[key] = array[index]['name'];
        }
        return json;
    },
    _renderEditor : function(row, grid) {
        if (this.allowEdit && this.editor) {
            var cls = this.editor.type;
            var url = this.editor.url;
            this.data = this.editor.data;
            var editorHtml = '<div class="cell"><span ';
            editorHtml += 'id="' + this._uuid + '" ';
            editorHtml += 'class="boot-' + cls + '" ';
            editorHtml += 'customOptions="{_parent: {rowUUID: \'' + row._uuid + '\', columnIndex: ' + this._index + ', field: \'' + this.field + '\'}}" ';
            if(this.editor.required){
                this.required = this.editor.required;
                editorHtml += 'required="' + this.editor.required + '" ';
            }
            if(this.editor.vType){
                this.vType = this.editor.vType;
                editorHtml += 'vType="' + this.editor.vType + '" ';
            }
            editorHtml += 'value="' + (row[this.field] || "") + '" ';
            if ((cls == 'combobox' || cls == 'popupedit' || cls == 'popupwindow') && url) {
                editorHtml += 'url="' + url + '" textField="name" valueField="id" ';
            }
            if (cls == 'popupedit' || cls == 'popupwindow') {
                if (this.editor.onload)
                    editorHtml += 'onload="' + this.editor.onload + '" ';
                if (this.editor.ondestroy)
                    editorHtml += 'ondestroy="' + this.editor.ondestroy + '" ';
                if (this.editor.popupWidth)
                    editorHtml += 'popupWidth="' + this.editor.popupWidth + '" ';
                if (this.editor.popupHeight)
                    editorHtml += 'popupHeight="' + this.editor.popupHeight + '" ';
            }
            if (cls == 'combobox' && this.data) {
                editorHtml += 'data="' + JSON.stringify(this.data).replace(/\"/g, '\'') + '" ';
            }
            if (cls == 'date'){
                this.format = this.editor.format || 'yyyy-MM-dd';
                editorHtml += 'format="' + this.format + '" ';
            }
            editorHtml += 'style="width: 100%;"></span></div>';
        } else {
            editorHtml = this._renderCell(row, grid);
        }
        return editorHtml;
    },
    _renderHead : function() {//TODO renderHead
        var id = this._uuid + '$head$' + this._index;
        var head = '<div id="' + id + '" class="cell">';
        if (this.allowSort) {
            head = '<div id="' + id + '" class="cell grid-sort">';
        }
        head += this.text;
        if (this.allowSort) {
            var sortId = this._uuid + '$sort$' + this.field;
            head += '<div id="' + sortId + '" class="sort ' + this.sort + '"></div>';
        }
        head += '</div>';
        return head;
    },
    _getAttrs : function(el) {
        if (!el) {
            return;
        }
        this.text = el.text();
        var attrs = {
            str : ["field", "format"],
            number : ["width"],
            json : ["editor"],
            bool : ["locked", "show", "merge", "allowSort"]
        };
        boot.concat(this, boot._parseEvent(el, ["render"]));
        boot.concat(this, boot._getBasicAttrs(el, attrs));
    },
    _destory : function() {
        boot.Destroy(this._uuid);
    }
};

/**------------------自定义列类----------------------**/

boot.IndexColumn = function(show) {
    this._uuid = boot.newId();
    this.show = show;
    this.width = 40;
    this.locked = true;
    this._init();
    this._index = 0;
};
boot.extend(boot.IndexColumn, boot.Column, {
    _init : function() {
        this.text = '序号';
    },
    _renderCell : function(row) {
        return '<div id="' + row._uuid + '$text" class="cell">' + row._num + '</div>';
    },
    _renderEditor : undefined
});

boot.ControlColumn = function(show, type) {
    this._uuid = boot.newId();
    this._index = 2;
    this.show = show;
    this.width = 50;
    this.locked = true;
    this.text = "";
    this.type = type || ['add', 'edit', 'remove'];
    this._init();
};
boot.extend(boot.ControlColumn, boot.Column, {
    _init : function() {
        var array = [];
        for (var index in this.type) {
            var type = this.type[index];
            if (type === 'add') {
                this.text += '<a class="boot-grid-button button-add" action="add"></a>';
            } else if (this.type[index] === 'remove') {
                //TODO暂时去掉全部删除功能
                // this.text += '<a class="boot-grid-button button-remove" action="remove"></a>';
                array.push(type);
            } else {
                array.push(type);
            }
        }
        this.type = array;
    },
    _renderCell : function(row) {
        var editting = row._allowEdit ? row._editting ? ['submit'] : this.type : [];
        var cellHtml = '<div id="' + row._uuid + '$text" class="cell">';
        for (var index in editting) {
            cellHtml += '<a class="boot-grid-button button-' + editting[index] + '" uuid="' + row._uuid + '" action="' + editting[index] + '"></a>';
        }
        cellHtml += '</div>';
        return cellHtml;
    },
    _renderHead : function() {//TODO renderHead
        var id = this._uuid + '$head$' + this._index;
        return '<div id="' + id + '">' + this.text + '</div>';
    },
    _renderEditor : undefined
});

boot.SelectBoxColumn = function(show, multi) {
    this._uuid = boot.newId();
    this._index = 1;
    this._disabled = false;
    this.width = 30;
    this.show = show;
    this.multi = multi;
    this.locked = true;
    this._init();
};
boot.extend(boot.SelectBoxColumn, boot.Column, {
    _init : function() {
        this.type = this.multi ? 'checkbox' : 'radio';
        this.text = '<input type="' + this.type + '"/>';
    },
    _renderCell : function(row) {
        var name = this.multi ? '' : 'name="' + this._uuid + '$radio"';
        var checked = row._checked ? 'checked="true"' : '';
        var disabled = row._allowCheck === false ? 'disabled="true"' : '';
        return '<div id="' + row._uuid + '$text" class="cell"><input ' + name + ' id="' + row._uuid + '$selectbox" type="' + this.type + '" ' + checked + ' ' + disabled + '/></div>';
    },
    _renderEditor : undefined
});
