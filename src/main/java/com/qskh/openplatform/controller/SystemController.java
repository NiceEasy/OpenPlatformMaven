package com.qskh.openplatform.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.qskh.openplatform.entity.SysLabel;

@Controller
@RequestMapping("/system")
public class SystemController {
	private Logger logger=Logger.getLogger(this.getClass());
	
	@ResponseBody
	@RequestMapping(value ="/labels.do",method={RequestMethod.POST,RequestMethod.GET})
	public String selectUserList(Model model){
		Map<String,Object> temp = new HashMap<>();
		List<SysLabel> list = new ArrayList<>();
		try {
			logger.info("查询下拉数据");
			for (int i = 0; i < 6; i++) {
				SysLabel label = new SysLabel();
				label.setId(i+"");
				label.setName(i+""+"A");
				list.add(label);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		temp.put("label", list);
		return JSON.toJSONString(list);
	}
	
	@RequestMapping(value ="/systemConfig.do",method={RequestMethod.POST,RequestMethod.GET})
	public String fileUpload(Model model){
		return "system/systemConfig";
	}
}
