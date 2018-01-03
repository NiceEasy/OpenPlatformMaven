package com.qskh.openplatform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/links")
public class LinksController {

	@RequestMapping(value ="/linksList.do",method={RequestMethod.POST,RequestMethod.GET})
	public String fileUpload(Model model){
		return "links/linksList";
	}
}
