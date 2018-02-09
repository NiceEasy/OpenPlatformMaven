package com.qskh.openplatform.controller;

import java.awt.Color;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Table;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.rtf.RtfWriter2;
import com.lowagie.text.rtf.graphic.RtfShape;
import com.lowagie.text.rtf.graphic.RtfShapePosition;
import com.lowagie.text.rtf.graphic.RtfShapeProperty;

public class ITextWordDemo {




    /*
     * 现状评估
     * */
    public static String addReport() {

        Long name = System.currentTimeMillis();
        String filePath =  "E://PDF//"
        		+ name
        		+ ".doc";
        File file = new File(filePath);

        Document document = new Document(PageSize.A4);

        try {
            RtfWriter2.getInstance(document, new FileOutputStream(file));
        } catch (FileNotFoundException e2) {
            e2.printStackTrace();
        }
        document.open();
        BaseFont bfChinese = null;
        try {
            bfChinese = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        } catch (DocumentException | IOException e1) {
            e1.printStackTrace();
        }
        Font titleFont = new Font(bfChinese, 22, Font.BOLD);
        //Font contextFont = new Font(bfChinese, 10, Font.NORMAL);
        Paragraph title = new Paragraph("统计报告", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);

        // 红色的线
        RtfShapePosition position;
        position = new RtfShapePosition(150, 0, 10400, 170);
        position.setXRelativePos(RtfShapePosition.POSITION_X_RELATIVE_MARGIN);
        position.setYRelativePos(RtfShapePosition.POSITION_Y_RELATIVE_PARAGRAPH);
        RtfShape shape = new RtfShape(RtfShape.SHAPE_RECTANGLE, position);
        RtfShapeProperty property = new RtfShapeProperty(RtfShapeProperty.PROPERTY_LINE_COLOR, Color.RED);
        shape.setProperty(property);


        Table table = null;
        try {
            table = new Table(4);
            int width[] = { 40, 30, 15, 15 };// 设置每列宽度比例
            table.setWidths(width);
        } catch (Exception e1) {
            e1.printStackTrace();
        }

        table.setBorderWidth(1);
        table.setBorderColor(Color.BLACK);
        table.setPadding(0);
        table.setSpacing(0);
        String time = "";
        String titleinfo = "";
        String url = "";
        String channel = "";
        try {
            for (int i = 0;i<5;i++) {
                table.addCell(new Paragraph(titleinfo));
                table.addCell(new Paragraph(url));
                table.addCell(new Paragraph(channel));
                table.addCell(new Paragraph(time));

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            document.add(table);
        } catch (DocumentException e1) {
            e1.printStackTrace();
        }

        try {
//          添加图片
            Image img = Image.getInstance("E://PDF//1234.png");
            img.setAbsolutePosition(0, 0); 
            img.setAlignment(Image.ALIGN_CENTER);
            // 设置图片显示位置
            img.scalePercent(30);
            //表示显示的大小为原尺寸的30% 
            document.add(img); 
            document.add(new Paragraph("\n")); 
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        document.close();

        return "ok";
    }
   

    
   public static void main(String[] args) {
	   addReport();
   }

}
