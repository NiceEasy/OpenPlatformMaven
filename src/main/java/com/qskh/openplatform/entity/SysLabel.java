package com.qskh.openplatform.entity;

import java.io.Serializable;

public class SysLabel implements Serializable{
	private static final long serialVersionUID = 1L;
	public String id;
	public String name;
	public String type;
	public String labelKeys;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getLabelKeys() {
		return labelKeys;
	}
	public void setLabelKeys(String labelKeys) {
		this.labelKeys = labelKeys;
	}
}
