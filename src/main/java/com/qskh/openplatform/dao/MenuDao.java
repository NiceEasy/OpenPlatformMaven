package com.qskh.openplatform.dao;

import java.util.List;
import java.util.Map;

import com.qskh.openplatform.entity.Menu;


public interface MenuDao {
	List<Menu> selectList(Map<String,Object> Map);
	
    int insert(Menu record);

    int insertSelective(Menu record);
    
}