package com.qskh.openplatform.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qskh.openplatform.dao.MenuDao;
import com.qskh.openplatform.entity.Menu;
import com.qskh.openplatform.service.MenuService;

@Service("menuServiceImpl")
public class MenuServiceImpl implements MenuService {
	@Autowired
	private MenuDao menuDao;
	
	@Override
	public List<Menu> selectMenuList(Map<String, Object> map) throws Exception {
		return menuDao.selectList(map);
	}
}
