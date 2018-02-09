package com.qskh.openplatform.controller;

import java.io.FileOutputStream;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chapter;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.Section;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;


public class ITextPDFDemo {
	public boolean iTextTest() {
        try {
            /** 实例化文档对象 */
            BaseFont bfchinese = BaseFont.createFont("C:/WINDOWS/Fonts/SIMYOU.TTF", BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);   
            
            Rectangle pageSize = new Rectangle(PageSize.A4); // 页面大小设置为A4
            Document document  = new Document(pageSize, 20, 20, 40, 40); // 创建doc对象并设置边距
            /** 创建 PdfWriter 对象 */
            PdfWriter.getInstance(document,// 文档对象的引用
                    new FileOutputStream("E:\\PDF\\ITextTest.pdf"));//文件的输出路径+文件的实际名称
            document.open();// 打开文档
            /** pdf文档中中文字体的设置，注意一定要添加iTextAsian.jar包 */
            BaseFont bfChinese = BaseFont.createFont("C:/WINDOWS/Fonts/SIMYOU.TTF", BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);  
            Font FontChinese = new Font(bfChinese, 12, Font.NORMAL);//加入document：
            
            BaseColor borderColor = new BaseColor(90, 140, 200);
            BaseColor bgColor = new BaseColor(80, 130, 180);
            
            /** 向文档中添加内容，创建段落对象 */
            document.add(new Paragraph("First page of the document."));// Paragraph添加文本
            document.add(new Paragraph("我们是害虫", FontChinese));
            /** 创建章节对象 */
            Paragraph title1 = new Paragraph("第一章", FontChinese);
            Chapter chapter1 = new Chapter(title1, 1);
            chapter1.setNumberDepth(0);
            /** 创建章节中的小节 */
            Paragraph title11 = new Paragraph("表格的添加", FontChinese);
            Section section1 = chapter1.addSection(title11);
            /** 创建段落并添加到小节中 */
            Paragraph someSectionText = new Paragraph("下面展示的为3 X 2 表格.",
                    FontChinese);
            section1.add(someSectionText);
            document.add(chapter1);
            /** 创建表格对象（包含行列矩阵的表格） */
            PdfPTable  table = new PdfPTable (new float[] {28,19,15});// 2行3列
            for (int i = 0; i < 5; i++) {
                if (i == 0) {
                    // row 1
                    table.addCell(createCell("API", bfchinese, borderColor, bgColor));
                    table.addCell(createCell("totile", 12, bfchinese, 3, null, borderColor, bgColor));
                    // row 2
                    table.addCell(createCell("描述", bfchinese, borderColor));
                    table.addCell(createCell("totile", 12, bfchinese, 3, null, borderColor));
                } else {
                    table.addCell(createCell("main", 10, bfchinese, null, Paragraph.ALIGN_RIGHT, borderColor));
                    table.addCell(createCell("main", 10, bfchinese, null, null, borderColor));
                    table.addCell(createCell("main", 10, bfchinese, null, null, borderColor));
                    table.addCell(createCell("main", 10, bfchinese, null, null, borderColor));
                }
            }
            
            document.add(table);
            /** 创建章节对象 */
            Paragraph title2 = new Paragraph("第二章", FontChinese);
            Chapter chapter2 = new Chapter(title2, 1);
            chapter2.setNumberDepth(0);
            /** 创建章节中的小节 */
            Paragraph title12 = new Paragraph("png图片添加", FontChinese);
            Section section2 = chapter2.addSection(title12);
            /** 添加图片 */
            section2.add(new Paragraph("图片添加: 饼图", FontChinese));
            Image png = Image.getInstance("E:\\PDF\\1234.png");//图片的地址
            section2.add(png);
            document.add(chapter2);
            document.close();
            return true;
        } catch (Exception e2) {
        	e2.printStackTrace();
            System.out.println(e2.getMessage());
        }
        return false;
    }
	
	
    // 用于生成cell
    private static PdfPCell createCell(String text, BaseFont font, BaseColor borderColor) {
        return createCell(text, 12, font, null, null, borderColor, null);
    }
    // 用于生成cell
    private static PdfPCell createCell(String text, BaseFont font, BaseColor borderColor, BaseColor bgColor) {
        return createCell(text, 12, font, null, null, borderColor, bgColor);
    }
    // 用于生成cell
    private static PdfPCell createCell(String text, int fontsize, BaseFont font, Integer colspan, Integer align, BaseColor borderColor) {
        return createCell(text, fontsize, font, colspan, align, borderColor, null);
    }
	
    /**
     * 用於生成cell
     * @param text          Cell文字内容
     * @param fontsize      字体大小
     * @param font          字体
     * @param colspan       合并列数量
     * @param align         显示位置(左中右，Paragraph对象)
     * @param borderColor   Cell边框颜色
     * @param bgColor       Cell背景色
     * @return
     */
    private static PdfPCell createCell(String text, int fontsize, BaseFont font, Integer colspan, Integer align, BaseColor borderColor, BaseColor bgColor) {
        Paragraph pagragraph = new Paragraph(text, new Font(font, fontsize));
        PdfPCell cell = new PdfPCell(pagragraph);
        cell.setFixedHeight(20);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE); // 上中下，Element对象
        if (align != null)
            cell.setHorizontalAlignment(align);
        if (colspan != null && colspan > 1)
            cell.setColspan(colspan);
        if (borderColor != null)
            cell.setBorderColor(borderColor);
        if (bgColor != null)
            cell.setBackgroundColor(bgColor);
        return cell;
    }
	
    public static void main(String args[]) {
        System.out.println(new ITextPDFDemo().iTextTest());
    }
}
