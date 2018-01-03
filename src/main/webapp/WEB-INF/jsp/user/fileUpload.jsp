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
<title>File Upload</title>
<link href="<%=basePath%>static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="<%=basePath%>static/bootstrap-fileinput/css/fileinput.min.css" media="all" rel="stylesheet" type="text/css" />
<style type="text/css">
	
</style>

<script src="<%=basePath%>js/jquery/jquery-3.2.1.min.js"> </script>
<script src="<%=basePath%>static/bootstrap-fileinput/js/fileinput.min.js" type="text/javascript"></script>
<script src="<%=basePath%>static/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
</head>
<body>
<label class="control-label">Sélectionnez Fichier</label>
<div class="file-loading">
    <input id="input-fr" name="inputfr[]" type="file" multiple>
</div>
</body>
<script>
$("#input-fr").fileinput({
    language: "fr",
    uploadUrl: "/file-upload-batch/2",
    allowedFileExtensions: ["jpg", "png", "gif"]
});
</script>
</html>