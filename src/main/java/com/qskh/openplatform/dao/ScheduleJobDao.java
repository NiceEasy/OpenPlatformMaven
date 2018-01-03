package com.qskh.openplatform.dao;

import java.util.List;
import java.util.Map;

import com.qskh.openplatform.entity.ScheduleJob;


public interface ScheduleJobDao {
	
	List<ScheduleJob> selectList(Map<String,Object> Map);
	
    int deleteByPrimaryKey(Integer id);

    int insert(ScheduleJob record);

    int insertSelective(ScheduleJob record);

    ScheduleJob selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(ScheduleJob record);

    int updateByPrimaryKey(ScheduleJob record);
}