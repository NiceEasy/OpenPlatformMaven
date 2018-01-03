<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%  //路径配置 
String path = request.getContextPath();   
String basePath = request.getScheme()+"://" +request.getServerName()+":" +request.getServerPort()+path+"/" ;   
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>error</title>
	<link href="<%=basePath%>css/error/error.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<%=basePath%>js/jquery/jquery-3.2.1.min.js"></script>
	<style type="text/css">
		/*背景*/
		.Fof_Bg{
			background-image:url(<%=basePath%>img/error/404_04.jpg);
			background-repeat: repeat-x;
			width: 800px;
			height: 497px;
			margin: 0 auto;
		}
		
			/*左边404怪兽图像*/
			.Monster_Left{
					background-image: url(<%=basePath%>img/error/404_05.jpg);
					background-repeat: no-repeat;
					background-position: 0 100%;
					width: 	269px;
					height: 497px;
					float: left;
			}
			
			/*右边404信息*/
			.Infor_Right{float: left;}
			
				.Text_Fof_Bg{
						background-image: url(<%=basePath%>img/error/404_02.jpg);
						background-repeat: no-repeat;
						width: 372px;
						height: 286px;
				}
	
	</style>
</head>
<body>
	<div class="Fof_Bg">
		<div class="Monster_Left"></div>
		<div class="Infor_Right">
			<div class="Key_Fof">
				<div class="Text_Fof_Bg"></div>
			</div>
		</div>
	</div>
</body>
</html>