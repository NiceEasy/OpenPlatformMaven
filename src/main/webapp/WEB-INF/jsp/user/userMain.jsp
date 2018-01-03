<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="mvc" uri="http://www.springframework.org/tags/form"%>
<%  //路径配置 
	String path = request.getContextPath();   
	String basePath = request.getScheme()+"://" +request.getServerName()+":" +request.getServerPort()+path+"/";   
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>UserMainPage</title>
 <link href="<%=basePath%>static/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>
 <link href="<%=basePath%>static/bootstrap/css/bootstrap-table.css" rel="stylesheet"/>
 <script src="<%=basePath%>js/jquery/jquery-3.2.1.min.js"></script>
 <script src="<%=basePath%>static/bootstrap/js/bootstrap.min.js"></script>
 <script src="<%=basePath%>static/bootstrap/js/bootstrap-table.js"></script>
 <script src="<%=basePath%>static/bootstrap/js/bootstrap-table-zh-CN.js"></script>
</head>
<body>
	<!-- 工具容器 -->
	<div id="toolbar" class="btn-group" style = "margin-top: 8px;">
		<button id="btn_add" type="button" class="btn btn-default"
			onclick="addVideoShow();">
			<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增
		</button>
		<button id="btn_delete" type="button" class="btn btn-default"
			onclick="batchUploadShow();">
			<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>批量上传
		</button>
		<button id="btn_edit" type="button" class="btn btn-default"
			onclick="editMemberInfoShow();">
			<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>选择修改
		</button>
		<button id="btn_delete" type="button" class="btn btn-default"
			onclick="delMemberVideo();">
			<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>选择删除
		</button>
	</div>
	<div style = "margin-top: -45px;">
		<table id = "bootstropTable"  
		class="table table-hover" ></table>
	</div>
</body>
<script type="text/javascript">
	$(document).ready(function() {
		$('#bootstropTable').bootstrapTable({
			method : 'post',
			url : "<%=basePath%>user/selectUserPageList.do",
			height : 560,
			striped : true,
			dataType : "json",
			pagination : true,
			singleSelect : true,
			strictSearch: true,
            clickToSelect: true,                //是否启用点击选中行
			pageSize : 10,
			pageNumber : 1,
			pageList:[10,20,30,40,"ALL"],
			search : true, //显示 搜索框
			showRefresh : true, //是否显示 刷新按钮
			showColumns : true, //不显示下拉框（选择显示的列）
			sidePagination : "server", //服务端请求
			queryParamsType:"undefined",
			queryParams : queryParams,
			showToggle:true,
			responseHandler : responseHandler,
			locale:'zh-CN',//中文支持,
			columns : [ 
			  {
				field: 'check',
				title: '',
				width : 1,
				checkbox:true,
				align : 'center'
			  },{
                  field: 'Number',
                  title: '编号',
                  width : 20,
  				  align : 'center',
                  formatter: function (value, row, index) {
                      return index+1;
                  }
				},{
				field : 'id',
				title : '主键',
				width : 100,
				align : 'center',
				valign : 'middle',
				sortable : false

			},{
				field : 'name',
				title : '姓名',
				width : 100,
				align : 'center',
				valign : 'middle',
				sortable : false

			}, {
				field : 'password',
				title : '密码',
				width : 100,
				align : 'center',
				valign : 'middle',
				sortable : false

			} ]
		});

		//行选中
		$('#bootstropTable').on('click-row.bs.table', function (e, row, element) 
				{
					$(element).css({"color":"blue","font-size":"16px;"});
					console.log(row);
					
				});
	});
	function responseHandler(res) {
		if (res) {
			return {
				"rows" : res.rows,
				"total" : res.total
			};
		 }else {
			return {
				"rows" : [],
				"total" : 0
			};
		}

	}
	//传递的参数
	function queryParams(params) {
		return {
			pageSize : params.pageSize,
			pageNumber : params.pageNumber
		};
	}
	
	
	//添加功能
	function addVideoShow(){
		var row= $("#bootstropTable").bootstrapTable('getSelections');
		console.info("添加功能"+row[0].id);
	}
	
	function batchUploadShow(){
		console.log("upload");
	}
	
	function editMemberInfoShow(){
		console.log("edit");
	}
	
	function delMemberVideo(){
		console.log("remove");
	}
</script>
</html>