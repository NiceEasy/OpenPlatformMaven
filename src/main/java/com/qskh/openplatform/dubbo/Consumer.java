package com.qskh.openplatform.dubbo;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Consumer {
	 public static void main(String[] args) throws Exception {
	        @SuppressWarnings("resource")
			ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"dubbo-demo-consumer.xml"});
	        context.start();

	        DubboDemoService demoService = (DubboDemoService)context.getBean("demoService"); // 获取远程服务代理
	        String hello = demoService.sayHello("world"); // 执行远程方法

	        System.out.println( hello ); // 显示调用结果
	    }
}
