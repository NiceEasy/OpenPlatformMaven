<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%  //路径配置 
String path = request.getContextPath();   
String basePath = request.getScheme()+"://" +request.getServerName()+":" +request.getServerPort()+path+"/" ;   
%> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>404</title>
    <meta http-equiv="X-UA-Compatible" content="IE=9">
	<meta name="viewport" content="width=device-width, initial-scale = 1.0, user-scalable = no">
	<title>出错了!</title>
    <link href="<%=basePath%>css/error/404.css" rel="stylesheet" type="text/css" />
    <style>
     	.error_404 .error_pic {
 			float:left;
 			width:560px;
 			height:540px;
			background:url(<%=basePath%>img/error/error_404.jpg) 0 0 no-repeat;
 		}
    </style>
    
    <script type="text/javascript" src="<%=basePath%>js/jquery/jquery-3.2.1.min.js"></script>
	<script type="text/javascript">
		$(function(){
			 $("#back_top > a").click(function(){
				$("html, body").animate({scrollTop:"0px"},1000);
				return false
			});
		})
	</script>
 <script type="text/javascript">
 	var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
 	document.write(
 			unescape(""));
 </script>
</head>
<body>
	<div class="menu"></div>
	<div class="error_404">
	<div class="container clearfix">
    	<div class="error_pic"></div>
        <div class="error_info">
        	<h2>对不起，您访问的页面不存在！</h2>
            <div class="operate">
            	<input class="global_btn btn_89bf43" onclick="returnIndex()" type="button" value="返回主页">
                <input class="global_btn btn_39dec8 ml1" onclick="history.go(-1)" type="button" value="返回上一页">
            </div>
        </div>
        <div style="display: hidden">
        	<form id = "returnIndex" action="<%=basePath%>index.do" method="post">
        	</form>
        </div>
    </div>
</div>
 <div id="cnzz_stat_icon_30061279"></div>
</body>
<script type="text/javascript">
	//跳转至主页
	function returnIndex(){
		$("#returnIndex").submit();
	}
</script>
</html>


