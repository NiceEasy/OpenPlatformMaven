package com.qskh.openplatform.entity;

import java.util.Date;
/**
 * 类名称：Menu.java 类描述：
 * @author NICE 作者单位： 联系方式：
 * @version 1.0
 */
import java.io.Serializable;

public class Menu implements Serializable {
	private static final long serialVersionUID = 1L;
    private String id;
    private String name;
    private String nameEN;
    private String type;
    private String url;

    private String createUser;
    private Date createTime;
    private String createDept;
    private String updateUser;
    private Date updateTime;

    private String updateDept;
    private String version;
    private String fathercateId;
    private String isMenu;
    private Integer menuRange;

    private Integer kisQuick;
    private String icon;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getNameEN() {
        return nameEN;
    }

    public void setNameEN(String nameEN) {
        this.nameEN = nameEN == null ? null : nameEN.trim();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url == null ? null : url.trim();
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser == null ? null : createUser.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreateDept() {
        return createDept;
    }

    public void setCreateDept(String createDept) {
        this.createDept = createDept == null ? null : createDept.trim();
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser == null ? null : updateUser.trim();
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateDept() {
        return updateDept;
    }

    public void setUpdateDept(String updateDept) {
        this.updateDept = updateDept == null ? null : updateDept.trim();
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version == null ? null : version.trim();
    }

    public String getFathercateId() {
        return fathercateId;
    }

    public void setFathercateId(String fathercateId) {
        this.fathercateId = fathercateId == null ? null : fathercateId.trim();
    }

    public String getIsMenu() {
        return isMenu;
    }

    public void setIsMenu(String isMenu) {
        this.isMenu = isMenu == null ? null : isMenu.trim();
    }

    public Integer getMenuRange() {
        return menuRange;
    }

    public void setMenuRange(Integer menuRange) {
        this.menuRange = menuRange;
    }

    public Integer getKisQuick() {
        return kisQuick;
    }

    public void setKisQuick(Integer kisQuick) {
        this.kisQuick = kisQuick;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon == null ? null : icon.trim();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", name=").append(name);
        sb.append(", nameEN=").append(nameEN);
        sb.append(", type=").append(type);
        sb.append(", url=").append(url);
        sb.append(", createUser=").append(createUser);
        sb.append(", createTime=").append(createTime);
        sb.append(", createDept=").append(createDept);
        sb.append(", updateUser=").append(updateUser);
        sb.append(", updateTime=").append(updateTime);
        sb.append(", updateDept=").append(updateDept);
        sb.append(", version=").append(version);
        sb.append(", fathercateId=").append(fathercateId);
        sb.append(", isMenu=").append(isMenu);
        sb.append(", menuRange=").append(menuRange);
        sb.append(", kisQuick=").append(kisQuick);
        sb.append(", icon=").append(icon);
        sb.append("]");
        return sb.toString();
    }
}