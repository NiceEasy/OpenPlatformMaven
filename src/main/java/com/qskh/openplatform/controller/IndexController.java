package com.qskh.openplatform.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.support.RequestContext;

import com.qskh.openplatform.entity.User;

/**
 * @ClassName: IndexController
 * @Description: 登录与主页控制
 * @author Administrator
 * @date 2017年9月21日
 */
@Controller
public class IndexController {
	private Logger logger=Logger.getLogger(this.getClass());
	
	@RequestMapping("/")
	public String Index(Model model, HttpServletRequest request) {
		//后台获取国际化的信息
				RequestContext requestContext = new RequestContext(request);
				String message = requestContext.getMessage("welcome");  //获取国际化信息
				System.out.println(message); 
		return "index";
	}

	@RequestMapping(value ="/index.do", method=RequestMethod.POST)
	public String IndexSecond(Model model, HttpServletRequest request) {
		//后台获取国际化的信息
				//RequestContext requestContext = new RequestContext(request);
				//String message = requestContext.getMessage("welcome");  //获取国际化信息
				
				HttpSession session = request.getSession();
				 String username = (String) session.getAttribute("username");
				 System.out.println(" username "+username); 
				 if(username.toLowerCase().equals("admin")){  //ok
					 session.setAttribute("username", "admin");
					 model.addAttribute("msg", "hello springmvc!");
					 System.out.println("登录 写入 用户名  admin");	
					 return "index";
				 }else{
					 return "user/login";
				 }			 			
	}
	
	/**
	 * @Title: background
	 * @Description: 北京说明
	 * @param model
	 * @param request
	 * @return String 背景页面
	 */
	@RequestMapping("/backGround.do")
	public String background(Model model, HttpServletRequest request) {
		//后台获取国际化的信息
				RequestContext requestContext = new RequestContext(request);
				String message = requestContext.getMessage("welcome");  //获取国际化信息
				System.out.println(message); 
		return "background";
	}
	
	
	
	@RequestMapping(value ="/login.do",method={RequestMethod.POST,RequestMethod.GET})
	public String loging(Model model, HttpServletRequest request){
		HttpSession session = request.getSession();
		 String username = (String) session.getAttribute("username");
		 if(username != null && username.length()>0){
			 return "index";
		 }else{
			 model.addAttribute("msg", "hello springmvc!");
			 System.out.println("登录 ABC");
			 return "user/login"; 
		 }
	}
	
	@ResponseBody
	@RequestMapping(value ="/toLogin.do",method={RequestMethod.POST})
	public String toLoging(User user,HttpServletRequest request){

		 String username = user.getName();
		 String password = user.getPassword();
		 HttpSession session = request.getSession();
		 if(username.toLowerCase().equals("admin")){  //ok
			 session.setAttribute("username", "admin");
			 System.out.println("登录 写入 用户名  admin "+username+" "+password);	
			 return "loginOk";
		 }else{
			 return "loginError";
		 }		 
		 
	}
	
	/**
	 * @Title: logOut
	 * @Description: 退出登录
	 * @param  model
	 * @param  request
	 * @return String 返回类型
	 */
	@RequestMapping(value ="/logOut.do",method={RequestMethod.POST})
	public String logOut(Model model, HttpServletRequest request){
		HttpSession session = request.getSession();
		session.removeAttribute("username");
		logger.info("退出登录----！");
		return "user/login";
	}
}
