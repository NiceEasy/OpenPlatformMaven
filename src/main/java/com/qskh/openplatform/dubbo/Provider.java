package com.qskh.openplatform.dubbo;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Provider {
	
	public static void main(String[] args) throws Exception {
        @SuppressWarnings("resource")
		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"dubbo-demo-provider.xml"});
        context.start();
        System.out.println("dubbo service begin to start");
        try {			
        	System.in.read();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
