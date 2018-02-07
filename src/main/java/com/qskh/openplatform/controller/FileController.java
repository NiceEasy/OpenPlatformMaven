package com.qskh.openplatform.controller;

import java.io.File;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传测试
 * @author weiliufang
 *
 */
@Controller
@RequestMapping("/fileUploadTest")
public class FileController {
	
	
	@RequestMapping(value="/testUpload.do",method={RequestMethod.POST,RequestMethod.GET})
	public String testUpload(Model model, HttpServletRequest request) {
		System.out.println("Test Abc");
		return "fileUploadTest/testUpload";
	}
	
	@RequestMapping(value="upload",method=RequestMethod.POST)
	@ResponseBody
    public String upload(HttpServletRequest request,
           @RequestParam("description") String description,
           @RequestParam("file") MultipartFile file) throws Exception {

       System.out.println(description);
       //如果文件不为空，写入上传路径
       if(!file.isEmpty()) {
           //上传文件路径
           String path = request.getServletContext().getRealPath("/images/");
           //上传文件名
           String filename = file.getOriginalFilename();
           File filepath = new File(path,filename);
           //判断路径是否存在，如果不存在就创建一个
           if (!filepath.getParentFile().exists()) { 
               filepath.getParentFile().mkdirs();
           }
           //将上传文件保存到一个目标文件当中
           file.transferTo(new File(path + File.separator + filename));
           return "success";
       } else {
           return "error";
       }

    }
}
