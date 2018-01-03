package com.qskh.openplatform.entity;

import java.io.Serializable;

/**
 * 
* 类名称：User.java
* 类描述： 
* @author NICE
* @version 1.0
 */
public class User extends BaseEntity implements Serializable{
	
	private static final long serialVersionUID = 1L;
	private String id;		//用户id
	private String name;	//用户名
	private String password; 	//密码
	
	@Override
	public String toString(){
	       StringBuilder sb = new StringBuilder();
	        sb.append(getClass().getSimpleName());
	        sb.append(" [");
	        sb.append("Hash = ").append(hashCode());
	        sb.append(", id=").append(id);
	        sb.append(", name=").append(name);
	        sb.append(", password=").append(password);
	        sb.append("]");
	        return sb.toString();
	}
	
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
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
