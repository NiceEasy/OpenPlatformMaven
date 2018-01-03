package com.qskh.openplatform.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
/**
 * 登录认证的拦截器
 */
public class LoginInterceptor implements HandlerInterceptor{

	/**
	 * Handler执行完成之后调用这个方法
	 */
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception exc)
			throws Exception {	
	}

	/**
	 * Handler执行之后，ModelAndView返回之前调用这个方法
	 */
	public void postHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler, ModelAndView modelAndView) throws Exception {
	}

	/**
	 * Handler执行之前调用这个方法
	 */
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler) throws Exception {
		//获取请求的URL
		String url = request.getRequestURI();
		if(url.indexOf("login.do") >= 0 
				|| url.indexOf(".css") >= 0 || url.indexOf(".png") >= 0
				|| url.indexOf(".js") >= 0 || url.indexOf(".jpg") >= 0
				|| url.indexOf(".BMP") >= 0 || url.indexOf(".JPG") >= 0
				|| url.indexOf(".JPEG") >= 0 || url.indexOf(".PNG") >= 0
				|| url.indexOf(".GIF") >= 0 || url.indexOf(".avi") >= 0
				|| url.indexOf(".flv") >= 0 || url.indexOf(".avi") >= 0
				|| url.indexOf(".rmvb") >= 0 || url.indexOf(".rm") >= 0
				|| url.indexOf(".mp4") >= 0 || url.indexOf(".flv") >= 0
				|| url.indexOf(".mpg") >= 0 || url.indexOf(".html") >= 0){
			return true;
		}
		
		HttpSession session = request.getSession();
		String username = (String)session.getAttribute("username");
		if(username != null){
			return true;
		}else{
				if(url.indexOf("toLogin.do") >= 0){
					return true;
				}
				System.out.println("no user in LoginInterceptor!!!");
				request.getRequestDispatcher("/WEB-INF/jsp/user/login.jsp").forward(request, response);
				return false;
		}
	}

}