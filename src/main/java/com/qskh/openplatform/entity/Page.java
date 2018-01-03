package com.qskh.openplatform.entity;

import java.util.List;

/**
 * 
 * @ClassName: Page
 * @Description: 分页使用
 * @author Administrator
 * @date 2017年9月19日
 * @param <T>
 */
public class Page<T> {
	private int pageSize;
    private int pageId;
    private int pageBegin;
    private int total;
    private int pageNumber;
    protected List<T> rows; // 当前页记录List形式
    
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize <= 0 ? 10 : pageSize;
	}
	public int getPageId() {
		return pageId;
	}
	public void setPageId(int pageId) {
		this.pageId = pageId;
	}
	//计算开始页码
	public int getPageBegin() {
		this.pageBegin = this.pageSize*this.pageNumber > 0 ? this.pageSize * (this.pageNumber-1) : 0;
		return pageBegin;
	}
	public void setPageBegin(int pageBegin) {
		this.pageBegin = pageBegin;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public int getPageNumber() {
		return pageNumber;
	}
	public void setPageNumber(int pageNumber) {
		this.pageNumber = pageNumber <= 0 ? 1 : pageNumber;
	}
	public List<T> getRows() {
		return rows;
	}
	public void setRows(List<T> rows) {
		this.rows = rows;
	}
}
