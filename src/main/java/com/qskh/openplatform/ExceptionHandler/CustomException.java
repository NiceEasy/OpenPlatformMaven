package com.qskh.openplatform.ExceptionHandler;

/**
 * 
 * @ClassName: CustomException
 * @Description: 自定义异常处理
 * @author NICE
 * @date 2017年7月12日
 */
public class CustomException extends Exception {
	private static final long serialVersionUID = 1L;
	//异常信息
    public String message;

    public CustomException(String message) {
        super(message);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}