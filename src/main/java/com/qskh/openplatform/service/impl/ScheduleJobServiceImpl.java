package com.qskh.openplatform.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qskh.openplatform.dao.ScheduleJobDao;
import com.qskh.openplatform.entity.ScheduleJob;
import com.qskh.openplatform.service.ScheduleJobService;

@Service
public class ScheduleJobServiceImpl implements ScheduleJobService{
	private Logger logger=Logger.getLogger(this.getClass());
	
	@Autowired
	private ScheduleJobDao timingTaskDao;
	
	@Override
	public List<ScheduleJob> selectScheduleJobList(Map<String, Object> map)throws Exception {
		return timingTaskDao.selectList(map);
	}
		
	// 3、创建Scheduler对象，并配置JobDetail和Trigger对象
	private static SchedulerFactory schedulerFactoryBean = new StdSchedulerFactory();
	
	/**
	 * 服务器启动，加载job_status=1的任务到任务队列中
	 * @throws Exception
	 */
	//@Scheduled(cron = "*/10 * * * * ?")
	@PostConstruct
	public void init() throws Exception {
		System.out.println("TEST ABCDEF........");
		// 这里获取任务信息数据
		List<ScheduleJob> jobList =  timingTaskDao.selectList(null);
		for (ScheduleJob job : jobList) {
			System.out.println(job.toString());
			
			if(job != null || job.getJobStatus() !=null){
				if(job.getJobStatus().equals(ScheduleJob.STATUS_RUNNING)){ //添加 
					addJob(job);
					runAJobNow(job);					
				}else if(job.getJobStatus().equals(ScheduleJob.STATUS_NOT_RUNNING)){
					deleteJob(job);
				}
			}
		}
		
	}
	
	
	
	public void testA(){
		System.out.println("TESTABC   定时任务-----"+UUID.randomUUID().toString());
	}
	
	 /**
		 * 添加任务到任务队列
		 * @param scheduleJob
		 * @throws SchedulerException
		 * @throws ClassNotFoundException
		 */
		@SuppressWarnings({ "rawtypes", "unchecked" })
		public ScheduleJob addJob(ScheduleJob job) throws SchedulerException, ClassNotFoundException {
			if (job == null || !ScheduleJob.STATUS_RUNNING.equals(job.getJobStatus())) {
				return null;
			}
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			logger.debug(scheduler
					+ ".......................................................................................add");
			TriggerKey triggerKey = TriggerKey.triggerKey(job.getJobName(), job.getJobGroup());
			CronTrigger trigger = (CronTrigger) scheduler.getTrigger(triggerKey);
			// 不存在，创建一个
			if (null == trigger) {
				Class clazz = Class.forName(job.getBeanClass());
				JobDetail jobDetail = JobBuilder.newJob(clazz).withIdentity(job.getJobName(), job.getJobGroup()).build();
				jobDetail.getJobDataMap().put("scheduleJob", job);
				CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
				trigger = TriggerBuilder.newTrigger().withIdentity(job.getJobName(), job.getJobGroup())
						.withSchedule(scheduleBuilder).build();
				scheduler.scheduleJob(jobDetail, trigger);
			} else {
				// Trigger已存在，那么更新相应的定时设置
				CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
				// 按新的cronExpression表达式重新构建trigger
				trigger = trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();
				// 按新的trigger重新设置job执行
				scheduler.rescheduleJob(triggerKey, trigger);
			}
			// 得到任务下一次的计划执行时间
			Date nextProcessTime = trigger.getNextFireTime();
			job.setNextProcessTime(nextProcessTime);
			return job;
		}

		/**
		 * 获取所有计划中的任务列表
		 * @return
		 * @throws SchedulerException
		 */
		@Deprecated
		public List<ScheduleJob> getAllJob() throws SchedulerException {
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			GroupMatcher<JobKey> matcher = GroupMatcher.anyJobGroup();
			Set<JobKey> jobKeys = scheduler.getJobKeys(matcher);
			List<ScheduleJob> jobList = new ArrayList<ScheduleJob>();
			for (JobKey jobKey : jobKeys) {
				List<? extends Trigger> triggers = scheduler.getTriggersOfJob(jobKey);
				for (Trigger trigger : triggers) {
					ScheduleJob job = new ScheduleJob();
					job.setJobName(jobKey.getName());
					job.setJobGroup(jobKey.getGroup());
					job.setDescription("触发器:" + trigger.getKey());
					Trigger.TriggerState triggerState = scheduler.getTriggerState(trigger.getKey());
					job.setJobStatus(triggerState.name());
					if (trigger instanceof CronTrigger) {
						CronTrigger cronTrigger = (CronTrigger) trigger;
						String cronExpression = cronTrigger.getCronExpression();
						job.setCronExpression(cronExpression);
					}
					jobList.add(job);
				}
			}
			return jobList;
		}

		/**
		 * 获取所有正在运行的job
		 * @return
		 * @throws SchedulerException
		 */
		@Deprecated
		public List<ScheduleJob> getRunningJob() throws SchedulerException {
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			List<JobExecutionContext> executingJobs = scheduler.getCurrentlyExecutingJobs();
			List<ScheduleJob> jobList = new ArrayList<ScheduleJob>(executingJobs.size());
			for (JobExecutionContext executingJob : executingJobs) {
				ScheduleJob job = new ScheduleJob();
				JobDetail jobDetail = executingJob.getJobDetail();
				JobKey jobKey = jobDetail.getKey();
				Trigger trigger = executingJob.getTrigger();
				job.setJobName(jobKey.getName());
				job.setJobGroup(jobKey.getGroup());
				job.setDescription("触发器:" + trigger.getKey());
				Trigger.TriggerState triggerState = scheduler.getTriggerState(trigger.getKey());
				job.setJobStatus(triggerState.name());
				if (trigger instanceof CronTrigger) {
					CronTrigger cronTrigger = (CronTrigger) trigger;
					String cronExpression = cronTrigger.getCronExpression();
					job.setCronExpression(cronExpression);
				}
				jobList.add(job);
			}
			return jobList;
		}

		/**
		 * 暂停一个job
		 * @param scheduleJob
		 * @throws SchedulerException
		 */
		@Deprecated
		public void pauseJob(ScheduleJob scheduleJob) throws SchedulerException {
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			JobKey jobKey = JobKey.jobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
			scheduler.pauseJob(jobKey);
		}

		/**
		 * 恢复一个job
		 * @param scheduleJob
		 * @throws SchedulerException
		 */
		@Deprecated
		public void resumeJob(ScheduleJob scheduleJob) throws SchedulerException {
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			JobKey jobKey = JobKey.jobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
			scheduler.resumeJob(jobKey);
		}

		/**
		 * 删除一个job
		 * @param scheduleJob
		 * @throws SchedulerException
		 */
		public void deleteJob(ScheduleJob scheduleJob) throws SchedulerException {
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			JobKey jobKey = JobKey.jobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
			scheduler.deleteJob(jobKey);
		}

		/**
		 * 立即执行job
		 * @param scheduleJob
		 * @throws SchedulerException
		 */
		public void runAJobNow(ScheduleJob scheduleJob) throws SchedulerException {
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			JobKey jobKey = JobKey.jobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
			scheduler.triggerJob(jobKey);
			scheduler.start();
		}

		/**
		 * 更新job时间表达式
		 * 
		 * @param scheduleJob
		 * @throws SchedulerException
		 */
		public ScheduleJob updateJobCron(ScheduleJob scheduleJob) throws SchedulerException {
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			TriggerKey triggerKey = TriggerKey.triggerKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
			CronTrigger trigger = (CronTrigger) scheduler.getTrigger(triggerKey);
			CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(scheduleJob.getCronExpression());
			trigger = trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();
			scheduler.rescheduleJob(triggerKey, trigger);
			// 得到任务下一次的计划执行时间
			Date nextProcessTime = trigger.getNextFireTime();
			scheduleJob.setNextProcessTime(nextProcessTime);
			return scheduleJob;
		}

}
