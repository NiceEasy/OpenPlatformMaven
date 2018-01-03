package com.qskh.openplatform.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.qskh.openplatform.entity.Menu;
import com.qskh.openplatform.service.MenuService;


@Controller
@RequestMapping("/menu")
public class MenuController {
	private Logger logger=Logger.getLogger(this.getClass());
	@Autowired
	private MenuService menuServiceImpl;
	
	
	@RequestMapping(value ="/menuMain.do",method={RequestMethod.POST,RequestMethod.GET})
	public String menuMain(Model model, HttpServletRequest request) {
		return "menu/menuMain";
	}
	
	@ResponseBody
	@RequestMapping(value ="/selectMenuAllList.do",method={RequestMethod.POST,RequestMethod.GET})
	public String selectUserList(Model model)throws Exception{
		Map<String,Object> temp = new HashMap<>();
			List<Menu> menuList = menuServiceImpl.selectMenuList(null);
			for (int i = 0; i < menuList.size(); i++) {
				temp.put(Integer.toString(i), menuList.get(i));
			}
			System.out.println(menuList.get(0).toString());
			logger.info("菜单功能测试！！！");
		return   JSON.toJSONString(menuList);
	}
	
	@ResponseBody
	@RequestMapping(value ="/selectTimingTaskList.do",method={RequestMethod.POST,RequestMethod.GET})
	public Map<String,Object> selectTimingTaskList(Model model)throws Exception{
		Map<String,Object> temp = new HashMap<>();

		return temp;
	}
}
