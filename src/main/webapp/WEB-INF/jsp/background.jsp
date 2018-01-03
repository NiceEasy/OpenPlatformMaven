<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@taglib prefix="mvc" uri="http://www.springframework.org/tags/form"%>
<%  //路径配置 
String path = request.getContextPath();   
String basePath = request.getScheme()+"://" +request.getServerName()+":" +request.getServerPort()+path+"/" ;   
%> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Backup Page</title>
<link rel="stylesheet" href="<%=basePath%>static/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="<%=basePath%>static/bootstrap-datetimepicker/css/bootstrap-datetimepicker-standalone.css">
<link rel="stylesheet" href="<%=basePath%>static/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">
<link rel="stylesheet" href="<%=basePath%>static/bootstrap-multiselect/css/bootstrap-multiselect.css">
<link rel="stylesheet" href="<%=basePath%>static/bootstrap/css/bootstrap-select.min.css">
<link rel="stylesheet" href="<%=basePath%>static/bootstrap-fileinput/css/fileinput.min.css">
<link rel="stylesheet" href="<%=basePath%>static/bootstrap-fileinput/css/fileinput-rtl.min.css">

<script src="<%=basePath%>js/jquery/jquery-3.2.1.min.js"> </script>
<script src="<%=basePath%>static/bootstrap-datetimepicker/js/moment-with-locales.min.js"></script>  
<script src="<%=basePath%>js/layer/layer.js"> </script>
<script src="<%=basePath%>static/bootstrap/js/bootstrap.min.js"> </script>
<script src="<%=basePath%>static/bootstrap/js/bootstrap-popover.js"> </script>
<script src="<%=basePath%>static/bootstrap/js/bootstrap-tooltip.js"> </script>
<script src="<%=basePath%>static/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"> </script>
<script src="<%=basePath%>static/bootstrap-multiselect/js/bootstrap-multiselect.js"> </script>
<script src="<%=basePath%>static/bootstrap/js/bootstrap-select.min.js"> </script>
<script src="<%=basePath%>static/bootstrap-fileinput/js/fileinput.min.js"> </script>
<script src="<%=basePath%>static/bootstrap-fileinput/js/locales/zh.js"> </script>
<style type="text/css">
body{
	background-color: #D1EEEE;
}
</style>
</head>
<body>
	<div style="margin-left: 20px;">
	

	 <p style="font-size: -webkit-xxx-large;text-align: center;">This is the backGround!</p><br>
	 <button  onclick="layerTest()">弹层测试</button><br><br>
		<!-- 	<div> -->
		<!-- 		<button type="button" class="btn btn-lg btn-danger" data-placement="bottom" -->
		<!-- 				data-toggle="popover" title="Test 弹框"  -->
		<!-- 				data-content="测试弹框内容">点我弹出/隐藏弹出框</button> -->
				
				
		<!-- 	</div> -->

	<!-- Large modal -->
	<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">Large modal</button><br><br>
	
	<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
	  <div class="modal-dialog modal-lg" role="document">
	    <div class="modal-content">
	      	案范围威风威风
	    </div>
	  </div>
	</div>

	<!-- Small modal -->
	<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-sm">Small modal</button><br><br>

	<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
	  <div class="modal-dialog modal-sm" role="document">
	    <div class="modal-content">
	     	 案范围威风威风
	    </div>
	  </div>
	</div>

	<div class='input-group date' style = "width:225px;" id='datetimepicker1' value="2012-05-15 21:05:00"  data-date-format="yyyy-mm-dd hh:ii:ss">  
	        <span>时间1</span>
	        <input size="16" id = 'datetimepicker3' type="text" value="2012-05-15 21:05:00" readonly>
	    	<span class="input-group-addon">  
	                    <span class="glyphicon glyphicon-calendar"></span>  
	        </span> 
	</div><br><br>
	<span>时间2</span>
	<input type="text" value="2014-09-23 23:05:00" id="datetimepicker2">
	<button id = "testABC" name = "testABC" onclick="getTimeButton()">获取时间值</button> <br><br><br>

	<div>
			<span>单选</span>
				<select id= "selectone" name = "selectone" class="multiselect">
				  <option>Mustard</option>
				  <option>Ketchup</option>
				  <option>Relish</option>
				</select>
			
			<span>多选</span>	
			<select id= "selecttwo" name = "selecttwo" class="multiselect" multiple="multiple">
			  <option value="cheese">Cheese</option>
			  <option value="tomatoes">Tomatoes</option>
			  <option value="mozarella">Mozzarella</option>
			  <option value="mushrooms">Mushrooms</option>
			  <option value="pepperoni">Pepperoni</option>
			  <option value="onions">Onions</option>
			</select>
			
			<select class="selectpicker" id="selectpickers">
				<option>---请选择---</option>
			</select>
	</div>
</div>
</body>
<script type="text/javascript">
$(function(){  
    $('#datetimepicker1').datetimepicker({  
        language:  'cn',  
        weekStart: 1,  
        todayBtn:  1,  
        autoclose: 1,  
        todayHighlight: 1,  
        startView: 2,  
        forceParse: 0,
        format: 'yyyy-mm-dd hh:ii:ss',
        autoclose:true,//日期选择完成后是否关闭选择框
        showMeridian: 1  
    }).on('changeDate', function (ev) {  
        $(this).datetimepicker('hide');  
    }); 
    
    
    $('#datetimepicker2').datetimepicker({
    	language:  'cn',  
        weekStart: 1,  
        todayBtn:  1,  
        autoclose: 1,  
        todayHighlight: 1,  
        startView: 2,  
        forceParse: 0,
        format: 'yyyy-mm-dd hh:ii:ss',
        autoclose:true,//日期选择完成后是否关闭选择框
        showMeridian: 1
    });
    //初始化下拉框
    $('.multiselect').multiselect();
    
    //动态下拉(select框架)
    getLayerLoad("selectpickers");
    
});


	
	// 文件上传框
	$('input[class=projectfile]').each(function() {
	    var imageurl = $(this).attr("value");
	
	    if (imageurl) {
	        var op = $.extend({
	            initialPreview : [ // 预览图片的设置
	            "<img src='" + imageurl + "' class='file-preview-image'>", ]
	        }, projectfileoptions);
	
	        $(this).fileinput(op);
	    } else {
	        $(this).fileinput();
	    }
	});
	
	
    $("#input-repl-1").fileinput({
        uploadUrl: "/file-upload-batch/2",
        autoReplace: true,
        maxFileCount: 1,
        allowedFileExtensions: ["jpg", "png", "gif"]
    });
    

function getTimeButton(){
	//alert("EEE");
	console.info($("#datetimepicker3").val()+" 1-1 "
			    +$("#datetimepicker2").val()
			    +"单选 多选"+$("#selectone").val()+" "+$("#selecttwo").val()+" select "+$("#selectpickers").val());
	
	//$("#datetimepicker2").datetimepicker("setStartDate", "2018-10-10 23:05");
	
	//$('#datetimepicker2').datetimepicker('setStartDate', '2018-10-10 23:05');
	//$('#datetimepicker2').datetimepicker('setEndDate', '2018-10-10 23:05');
	$('#datetimepicker2').val('2018-11-10 23:05:00');
}

	$(".layerTest").click(
		function(){
// 			layer.alert("弹出层提示信息", 1,function(index){
// 				layer.close(index); //再执行关闭
// 			})
			//页面层
			
			layer.open({
			  type: 1,
			  title: "页面层",
			  closeBtn: 0,
			  area: ['330px', '330px'],
			  skin: 'layui-layer-nobg', //没有背景色
			  shadeClose: true,
			  content: "abcdefefwef",
			  success: function(layero, index){
				    //console.log(layero, index);
					alert("ABCDEFGH");	 
			   }
			  
			});

		}
	)
	
	function layerTest(){
		layer.open({
			  title: "layer弹层测试",
			  shadeClose: true,
			  content: '测试回调',
			  yes: function(index, layero){
			    //do something
			    layer.close(index); //如果设定了yes回调，需进行手工关闭
			    console.log(index, layero);
			  },
			  cancel: function(index){
				  console.log("取消测试");
				  layer.close(index);
				  return false;
			    },
			    end:function(){
			    	console.log("关闭测试");
			    }
			});
	   }

	
	$(function () {
		  $('[data-toggle="popover"]').popover()
		})
	
		
	//动态下拉框（代码）
	function getLayerLoad(tcId){
			$.ajax({   
				url:'<%=basePath%>system/labels.do',
				dataType: 'json',
                method: 'post',
			    success:function(data){
			    //alert(data);
				    $("#"+tcId).empty();
				    $("#"+tcId).append("<option>---请选择---</option>");

				   $.each(data,function(i,o){
					    var opt="";
					    if(o.name){
					    opt+='<option url='+o.name+'>'+i+'</option>';
					    
					    }else{
					    opt+='<option url="">'+i+'</option>';
					    }
					    $("#"+tcId).append(opt);
					    });
					    $("#"+tcId).selectpicker('refresh');//动态加载
    
			    },error:function(){
			    	
			    }
			});
		}	
</script>
</html>