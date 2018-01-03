package com.qskh.openplatform.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.qskh.openplatform.datasource.DataSourceContextHolder;
import com.qskh.openplatform.datasource.DataSourceType;
import com.qskh.openplatform.dubbo.DubboDemoService;
import com.qskh.openplatform.entity.Page;
import com.qskh.openplatform.entity.User;
import com.qskh.openplatform.service.UserService;

@Controller
@RequestMapping("/user")
public class UserController {
	private Logger logger=Logger.getLogger(this.getClass());

	@Autowired
	private UserService userServiceImpl;
	
	/**
	 * @Title: hello
	 * @Description: 分布式方法调用测试
	 * @param @param model
	 * @param @return 参数
	 * @return String 返回类型
	 * @throws
	 */
	@RequestMapping(value ="/hello.do",method={RequestMethod.POST,RequestMethod.GET})
	public String hello(Model model) {
		model.addAttribute("msg", "hello springmvc!");
		logger.info("分布式调用测试");
		
        @SuppressWarnings("resource")
		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"dubbo-demo-consumer.xml"});
        context.start();

        DubboDemoService demoService = (DubboDemoService)context.getBean("demoService"); // 获取远程服务代理
        String hello = demoService.sayHello("world"); // 执行远程方法

        System.out.println( hello ); // 显示调用结果
		return "user/hello";
	}
	
	/**
	 * @Title: selectUserList
	 * @Description: 多数据源切换测试
	 * @param @param model
	 * @param @return 参数
	 * @return Map<String,Object> 返回类型
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value ="/DataSourceTest.do",method={RequestMethod.POST,RequestMethod.GET})
	public Map<String,Object> dataSourceTest(Model model){
		Map<String,Object> temp = new HashMap<>();
		try {
			//切换数据库  
			DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MOPTWO); 
			temp.put("name", "2");
			List<User> userList = userServiceImpl.selectUserList(temp);
			for (int i = 0; i < userList.size(); i++) {
				System.out.println(userList.get(i).getId());
			}
			DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MOPONE); 
		} catch (Exception e) {
			e.printStackTrace();
		}
		return temp;
	}
	
	@ResponseBody
	@RequestMapping(value ="/selectUserList.do",method={RequestMethod.POST,RequestMethod.GET})
	public Map<String,Object> selectUserList(Model model){
		Map<String,Object> temp = new HashMap<>();
		try {
			temp.put("name", "1");
			List<User> userList = userServiceImpl.selectUserList(temp);
			User user = new User();
			user.setName("1");
			Long count = userServiceImpl.selectCount(user);
			System.out.println(count);
			for (int i = 0; i < userList.size(); i++) {
				System.out.println(userList.get(i).toString());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return temp;
	}
	
	@ResponseBody
	@RequestMapping(value ="/selectUserPageList.do",method={RequestMethod.POST,RequestMethod.GET})
	public String selectPageUserList(Model model, HttpServletRequest request,@RequestBody Map<String, String> map){
		System.out.println(map.get("pageNumber"));
		User user = new User();
		Page<User> page = new Page<>();
		String pageSizeTemp = map.get("pageSize");
		String pageNumberTemp = map.get("pageNumber");
		
		Integer pageSize = (pageSizeTemp != null && pageSizeTemp.length()>0) ? 
													Integer.parseInt(pageSizeTemp) : 10;
		Integer pageNumber = (pageNumberTemp != null && pageNumberTemp.length() >0) ? 
													Integer.parseInt(pageNumberTemp) : 0;
		try {
			user.setPageSize(pageSize);
			user.setPageNumber(pageNumber);
			//条件查询，传参
			user.setName("2");
			List<User> list = userServiceImpl.selectUserPageList(user);
			page.setRows(list);
			Long count = userServiceImpl.selectCount(user);
			page.setTotal(new Long(count).intValue());
			System.out.println(count);
			for (User user2 : list) {
				System.out.println(user2.toString());				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return JSON.toJSONString(page);
	}
	
	@RequestMapping(value ="/userMain.do",method={RequestMethod.POST,RequestMethod.GET})
	public String userIndex(Model model) {
		model.addAttribute("msg", "hello springmvc!");
		logger.info("分页主页面");
        System.out.println("分页主页面"); // 显示调用结果
		return "user/userMain";
	}

	@RequestMapping(value ="/fileUpload.do",method={RequestMethod.POST,RequestMethod.GET})
	public String fileUpload(Model model){
		return "user/fileUpload";
	}
	
	@RequestMapping(value ="/vueTest.do",method={RequestMethod.POST,RequestMethod.GET})
	public String vueTest(Model model){
		return "user/vueTest";
	}
	
	@RequestMapping(value ="/login.do",method={RequestMethod.POST,RequestMethod.GET})
	public String login(Model model){
		return "user/login";
	}
	
}
