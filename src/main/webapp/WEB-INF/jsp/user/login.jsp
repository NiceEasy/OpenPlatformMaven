<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@taglib prefix="mvc" uri="http://www.springframework.org/tags/form"%>
<%  //路径配置 
	String path = request.getContextPath();   
	String basePath = request.getScheme()+"://" +request.getServerName()+":" +request.getServerPort()+path+"/" ;   
%> 
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>OpenPlaform Index Page</title>
<link href="<%=basePath%>static/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<script src="<%=basePath%>js/jquery/jquery-3.2.1.min.js" ></script>

<script type="text/javascript">
	function testfonction(){
		alert("测试方法!");		
	}
</script>
<style type="text/css">
	body {
	    background: #f8f8f8;
	    font-family: 'PT Sans', Helvetica, Arial, sans-serif;
	    text-align: center;
	}

	.page-container {
	      position: absolute;
		  top: 50%;
		  left: 50%;
		  transform: translate(-50%, -50%);
	}
	.page-container h1 {
		text-align: center;
	}
	
</style>

</head>
<body>
	<div class="page-container">
            <h1>登录</h1>
            <form method="post" action="<%=basePath%>index.do" name = "indexPage" id = "indexPage">
            </form>
            	<table>
            		<tr>
            			<td>用户名</td><td><input type="text" id = "username"  name="username" class="username"></td>
            		</tr>
            		<tr>
            			<td>密码</td><td><input type="password" id = "password" name="password" class="password"></td>            			
            		</tr>
            	</table>
           		<div class="center-block" style="text-align:center">
					<button  onclick="toLogin()" class="btn btn-info btn-search">提交</button>
				</div>
            
    </div>
</body>
<script type="text/javascript">
	function toLogin(){
		$.ajax({
            url: '<%=basePath%>toLogin.do',
            dataType: 'text',
            type: 'post',
            async: false,
            data: {'name': $('#username').val(), 'password': $('#password').val()},
            success: function(data) {
					console.info(data);
				if(data == 'loginOk'){
					toIndexPage();
				}else if(data == 'loginError'){
					
				}
            },
            error: function(xhr) {
                // 导致出错的原因较多，以后再研究
                //alert(xhr);
            }
        })
	}
	
	function toIndexPage(){
		console.info("wfewfewfwefwe");
		$("#indexPage").submit();
	}
</script>
</html>