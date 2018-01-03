boot.DataGrid4Schedule = function(id) {
    boot.DataGrid4Schedule.superClass.constructor.call(this, id);
};
boot.extend(boot.DataGrid4Schedule, boot.DataGrid, {
    uiCls : "boot-datagrid4schedule",
    _create: function(){
    	boot.DataGrid4Schedule.superClass._create.call(this);
    	this.el.addClass('boot-datagrid');
    },
    //设置某行为编辑状态
    _autoEditRow : function(row){
    	this._submitBeforeEditNext();
        row._editting = true;
        this._renderUpdateRow(row);
    },
    autoEditRow : function(row) {
    	this._autoEditRow(row);
    }
});

boot.Register(boot.DataGrid4Schedule, "datagrid4schedule");
