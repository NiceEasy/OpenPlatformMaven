package com.qskh.openplatform.controller;

import java.io.IOException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

/**
 * 导出PDF测试
 * @author weiliufang
 *
 */
public class PdfBoxTest {

	@SuppressWarnings("deprecation")
	public static void main(String[] args) {
		
		// Create a new empty document
		PDDocument document = new PDDocument();

		// Create a new blank page and add it to the document
		
		PDPage page = new PDPage();
		document.addPage( page );

		// Create a new font object selecting one of the PDF base fonts
		PDFont font = PDType1Font.TIMES_BOLD;
		try {
			
		// Start a new content stream which will "hold" the to be created content
			PDPageContentStream contentStream = new PDPageContentStream(document, page);
			
			PDImageXObject imagex =  PDImageXObject.createFromFile("E:\\PDF\\1234.png", document);
		    //contentStream.drawImage(imagex, 160, 200);
		    contentStream.drawImage(imagex, 160, 200, imagex.getWidth(), imagex.getHeight());

		// Define a text content stream using the selected font, moving the cursor and drawing the text "Hello World"
			contentStream.beginText();
			contentStream.setFont( font, 12 );
			contentStream.moveTextPositionByAmount( 100, 700 );//注意这个坐标，(0,0)为本页的左下角
			contentStream.drawString( "Hello World" );
			contentStream.endText();
			

		// Make sure that the content stream is closed:
		  contentStream.close();
		
		// closed.
			document.save("E:\\PDF\\BlankPage.pdf"); 
			document.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
