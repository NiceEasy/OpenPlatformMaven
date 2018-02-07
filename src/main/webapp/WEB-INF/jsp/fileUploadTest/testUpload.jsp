<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@taglib prefix="mvc" uri="http://www.springframework.org/tags/form"%>
<%  //路径配置 
String path = request.getContextPath();   
String basePath = request.getScheme()+"://" +request.getServerName()+":" +request.getServerPort()+path+"/" ;   
%> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>文件上传列表</title>
<script type="text/javascript" src="<%=basePath%>js/jquery/jquery-3.2.1.min.js"> </script>
<script type="text/javascript" src="<%=basePath%>js/jquery/jquery.form.js"> </script>
</head>
<body>
	<h2>文件上传</h2>
    <form action="<%=basePath%>fileUploadTest/upload" 
    			         id = "uploadForm" name="uploadForm" 
    			                   enctype="multipart/form-data" method="post">
        <table>
            <tr>
                <td>文件描述:</td>
                <td><input type="text" name="description"></td>
            </tr>
            <tr>
                <td>请选择文件:</td>
                <td><input type="file" name="file"></td>
            </tr>
            <tr>
                <td><input type="submit" value="上传"></td>
            </tr>
        </table>
    </form>
</body>
<script type="text/javascript">
	$(document).ready(function() {  
	       $("#uploadForm").ajaxForm(function(data){  
	             alert("post success." + data);  
	             //Alert("post success.");  
	       });            
	});  
</script>
</html>