package com.qskh.openplatform.util;


public class InterceptorUtils {
	public static Boolean getInterceptor(String url) {
		if(url.length()<0){
			if (url.indexOf("login.do") >= 0 || url.indexOf("toLogin.do") >= 0
					|| url.indexOf(".css") >= 0 || url.indexOf(".png") >= 0
					|| url.indexOf(".js") >= 0 || url.indexOf(".jpg") >= 0
					|| url.indexOf(".BMP") >= 0 || url.indexOf(".JPG") >= 0
					|| url.indexOf(".JPEG") >= 0 || url.indexOf(".PNG") >= 0
					|| url.indexOf(".GIF") >= 0 || url.indexOf(".avi") >= 0
					|| url.indexOf(".flv") >= 0 || url.indexOf(".avi") >= 0
					|| url.indexOf(".rmvb") >= 0 || url.indexOf(".rm") >= 0
					|| url.indexOf(".mp4") >= 0 || url.indexOf(".flv") >= 0
					|| url.indexOf(".mpg") >= 0 || url.indexOf(".html") >= 0
					) {
				return true;
			} else {
				return false;
			}
		}else{
			return false;
		}
	}
}
