package com.qskh.openplatform.dao;
import java.util.List;
import java.util.Map;

import com.qskh.openplatform.entity.User;

public interface UserDao {
	
	List<User> selectPage(User record);
	
	Long selectCount(User record);
	
	List<User> selectUserList(Map<String,Object> map);
	
    int insert(User record);

    int insertSelective(User record);
}