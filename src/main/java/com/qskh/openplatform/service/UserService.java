package com.qskh.openplatform.service;

import java.util.List;
import java.util.Map;

import com.qskh.openplatform.entity.User;

public interface UserService{
	public List<User> selectUserPageList(User record)throws Exception;

	public List<User> selectUserList(Map<String,Object> map);
	
	public Long selectCount(User record);
}
