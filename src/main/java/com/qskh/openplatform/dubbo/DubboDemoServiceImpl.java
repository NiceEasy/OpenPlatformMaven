package com.qskh.openplatform.dubbo;

import java.util.UUID;

public class DubboDemoServiceImpl implements DubboDemoService {

	@Override
	public String sayHello(String name) {
		System.out.println(UUID.randomUUID().toString());
		return "Hello " + name;
	}

}
