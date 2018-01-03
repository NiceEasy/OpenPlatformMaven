package com.qskh.openplatform.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qskh.openplatform.dao.UserDao;
import com.qskh.openplatform.entity.User;
import com.qskh.openplatform.service.UserService;

@Service("userServiceImpl")
public class UserServiceImpl implements UserService{

	@Autowired
	private UserDao userDao;
	
	@Override
	public List<User> selectUserPageList(User record) throws Exception{
		return userDao.selectPage(record);
	}

	@Override
	public List<User> selectUserList(Map<String,Object> map) {
		return userDao.selectUserList(map);
	}

	@Override
	public Long selectCount(User record) {
		return userDao.selectCount(record);
	}

}
