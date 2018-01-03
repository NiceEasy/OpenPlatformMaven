package com.qskh.openplatform.service;

import java.util.List;
import java.util.Map;

import com.qskh.openplatform.entity.Menu;

public interface MenuService {
	public List<Menu> selectMenuList(Map<String,Object> map)throws Exception;
}
