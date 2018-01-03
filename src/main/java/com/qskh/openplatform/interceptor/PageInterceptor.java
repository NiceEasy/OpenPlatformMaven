package com.qskh.openplatform.interceptor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.resultset.ResultSetHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.reflection.DefaultReflectorFactory;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.SystemMetaObject;
import com.qskh.openplatform.entity.Page;

@Intercepts({
     @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class,Integer.class}),  
     @Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class})
})  
public class PageInterceptor implements Interceptor {  
  
    private static final String SELECT_ID="selectpage";


    //插件运行的代码，它将代替原有的方法
    @SuppressWarnings("rawtypes")
	@Override
    public Object intercept(Invocation invocation) throws Throwable{
        System.out.println("PageInterceptor -- intercept");
        
        if (invocation.getTarget() instanceof StatementHandler) {  
            StatementHandler statementHandler = (StatementHandler) invocation.getTarget();  
            
            MetaObject metaObject 
            	= MetaObject.forObject(statementHandler, SystemMetaObject.DEFAULT_OBJECT_FACTORY,  
            	    SystemMetaObject.DEFAULT_OBJECT_WRAPPER_FACTORY, new DefaultReflectorFactory());
            
            MetaObject metaStatementHandler = SystemMetaObject.forObject(statementHandler);  
            MappedStatement mappedStatement=(MappedStatement) metaStatementHandler.getValue("delegate.mappedStatement");
            
            
            String selectId=mappedStatement.getId();
            
            if(SELECT_ID.equals(selectId.substring(selectId.lastIndexOf(".")+1).toLowerCase())){
                BoundSql boundSql = (BoundSql) metaStatementHandler.getValue("delegate.boundSql");  
                // 分页参数作为参数对象parameterObject的一个属性  
                String sql = boundSql.getSql();
                Page co=(Page)(boundSql.getParameterObject());
                
                // 重写sql  
                String countSql=concatCountSql(sql);
                String pageSql=concatPageSql(sql,co);
                
                System.out.println("重写的 count  sql:"+countSql);
                System.out.println("重写的 select sql:"+pageSql);
                
                Connection connection = (Connection) invocation.getArgs()[0];
             // 为了先查询总条数，所以需要先统计原始sql结果，但是原始sql中参数还没赋值，所以就需要先拿到原始sql的参数处理对象，通过反射工具  
                ParameterHandler parameterHandler = (ParameterHandler) metaObject.getValue("delegate.parameterHandler");  
                
                PreparedStatement countStmt = null;
                ResultSet rs = null;
                int totalCount = 0;
                try{
                    countStmt = connection.prepareStatement(countSql);
                    parameterHandler.setParameters(countStmt); 
                    rs = countStmt.executeQuery();
                    if (rs.next()) {
                        totalCount = rs.getInt(1);
                    }
                   
                }catch(SQLException e){ 
                    System.out.println("Ignore this exception"+e);
                }finally{
                    try {
                    	if(rs != null){
                    		rs.close();                 		
                    	}
                    	if(countStmt != null){
                    		countStmt.close();                   		
                    	}
                    } catch (SQLException e) {
                        System.out.println("Ignore this exception"+ e);
                    }
                }
                
                metaStatementHandler.setValue("delegate.boundSql.sql", pageSql);         
              
                //绑定count
                co.setTotal(totalCount);
            }
        }
        return invocation.proceed();
    }
    
    /**
     * 拦截类型StatementHandler 
     */
    @Override
    public Object plugin(Object target) {
        if (target instanceof StatementHandler) {
            return Plugin.wrap(target, this);
        } else {
            return target;
        }  
    }
    
    @Override
    public void setProperties(Properties properties) {  
  
    }  
    
    
    public String concatCountSql(String sql){
        StringBuffer sb=new StringBuffer("select count(*) from ");
        sql=sql.toLowerCase();
        
        if(sql.lastIndexOf("order")>sql.lastIndexOf(")")){
            sb.append(sql.substring(sql.indexOf("from")+4, sql.lastIndexOf("order")));
        }else{
            sb.append(sql.substring(sql.indexOf("from")+4));
        }
        return sb.toString();
    }
    
    @SuppressWarnings("rawtypes")
	public String concatPageSql(String sql,Page co){
        StringBuffer sb=new StringBuffer();
        sb.append(sql);
        sb.append(" limit ").append(co.getPageBegin()).append(" , ").append(co.getPageSize());
        return sb.toString();
    }
    public void setPageCount(){
        
    }
}
