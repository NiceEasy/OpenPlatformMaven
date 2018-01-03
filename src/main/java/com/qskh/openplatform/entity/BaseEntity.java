package com.qskh.openplatform.entity;

import java.io.File;
import java.io.Serializable;
import java.util.Date;

/**
 * @ClassName: BaseEntity
 * @Description: 基础类
 * @author NICE
 * @date 2017年7月12日
 */
public class BaseEntity extends Page<Object> implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id; // OID（对应数据库主键）
	private String createUser; // 创建人
	private Date createTime; // 创建时间

	private String updateUser; // 修改人
	private Date updateTime; // 修改时间
	private Integer version; // 版本号

	private File[] upload; // 上传的文件
	private String[] uploadFileName; // 上传文件的文件名
	private String[] uploadContentType; // 上传文件的后缀
	
	private String status; // 状态
	private Date searchStartDate; // 查询开始时间
	private Date searchEndDate; // 查询结束时间
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCreateUser() {
		return createUser;
	}
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public String getUpdateUser() {
		return updateUser;
	}
	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public Integer getVersion() {
		return version;
	}
	public void setVersion(Integer version) {
		this.version = version;
	}
	public File[] getUpload() {
		return upload;
	}
	public void setUpload(File[] upload) {
		this.upload = upload;
	}
	public String[] getUploadFileName() {
		return uploadFileName;
	}
	public void setUploadFileName(String[] uploadFileName) {
		this.uploadFileName = uploadFileName;
	}
	public String[] getUploadContentType() {
		return uploadContentType;
	}
	public void setUploadContentType(String[] uploadContentType) {
		this.uploadContentType = uploadContentType;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Date getSearchStartDate() {
		return searchStartDate;
	}
	public void setSearchStartDate(Date searchStartDate) {
		this.searchStartDate = searchStartDate;
	}
	public Date getSearchEndDate() {
		return searchEndDate;
	}
	public void setSearchEndDate(Date searchEndDate) {
		this.searchEndDate = searchEndDate;
	}
}
