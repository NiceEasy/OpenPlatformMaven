package com.qskh.openplatform.Quartz;

import java.util.Date;
import java.util.UUID;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

	public class MyJob implements Job{
	    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
	        System.out.println(new Date() + ": doing something...");
	    }
	    
	    public void testA(){
	    	
	    	System.out.println(UUID.randomUUID().toString());
	    }
}
