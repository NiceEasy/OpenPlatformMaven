package com.qskh.openplatform.service;

import java.util.List;
import java.util.Map;

import com.qskh.openplatform.entity.ScheduleJob;

public interface ScheduleJobService {
	public List<ScheduleJob> selectScheduleJobList(Map<String,Object> map)throws Exception;
}
