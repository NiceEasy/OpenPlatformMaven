package com.qskh.openplatform.entity;

import java.io.Serializable;
import java.util.Date;

public class ScheduleJob implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public static final String STATUS_RUNNING = "1";
	public static final String STATUS_NOT_RUNNING = "0";  
    public static final String CONCURRENT_IS = "1";  
    public static final String CONCURRENT_NOT = "0"; 

    private String jobId;
    private Date createTime; //任务创建时间
    private Date updateTime; //任务更新时间
    private Date lastProcessTime;  //上一次执行时间 
    private Date nextProcessTime;  //下次计划执行时间 

    private String jobName;       //任务名称 
    private String jobGroup;      //任务分组
    private String jobStatus;     //任务状态 是否启动任务
    private String cronExpression;  //cronExpression
    private String description;     //description

    private String isConcurrent;    //描述 
    private String springId;		//（暂时不用）
    private String beanClass;       //任务执行时调用哪个类的方法(包名+类名)
    private String methodName;      //方法名（暂时不用）
    
    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId == null ? null : jobId.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Date getLastProcessTime() {
        return lastProcessTime;
    }

    public void setLastProcessTime(Date lastProcessTime) {
        this.lastProcessTime = lastProcessTime;
    }

    public Date getNextProcessTime() {
        return nextProcessTime;
    }

    public void setNextProcessTime(Date nextProcessTime) {
        this.nextProcessTime = nextProcessTime;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName == null ? null : jobName.trim();
    }

    public String getJobGroup() {
        return jobGroup;
    }

    public void setJobGroup(String jobGroup) {
        this.jobGroup = jobGroup == null ? null : jobGroup.trim();
    }

    public String getJobStatus() {
        return jobStatus;
    }

    public void setJobStatus(String jobStatus) {
        this.jobStatus = jobStatus == null ? null : jobStatus.trim();
    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression == null ? null : cronExpression.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getIsConcurrent() {
        return isConcurrent;
    }

    public void setIsConcurrent(String isConcurrent) {
        this.isConcurrent = isConcurrent == null ? null : isConcurrent.trim();
    }

    public String getSpringId() {
        return springId;
    }

    public void setSpringId(String springId) {
        this.springId = springId == null ? null : springId.trim();
    }

    public String getBeanClass() {
        return beanClass;
    }

    public void setBeanClass(String beanClass) {
        this.beanClass = beanClass == null ? null : beanClass.trim();
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName == null ? null : methodName.trim();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", jobId=").append(jobId);
        sb.append(", createTime=").append(createTime);
        sb.append(", updateTime=").append(updateTime);
        sb.append(", lastProcessTime=").append(lastProcessTime);
        sb.append(", nextProcessTime=").append(nextProcessTime);
        sb.append(", jobName=").append(jobName);
        sb.append(", jobGroup=").append(jobGroup);
        sb.append(", jobStatus=").append(jobStatus);
        sb.append(", cronExpression=").append(cronExpression);
        sb.append(", description=").append(description);
        sb.append(", isConcurrent=").append(isConcurrent);
        sb.append(", springId=").append(springId);
        sb.append(", beanClass=").append(beanClass);
        sb.append(", methodName=").append(methodName);
        sb.append("]");
        return sb.toString();
    }
	
}