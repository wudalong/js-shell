package org.javascript.standalone.shell;

import java.io.InputStream;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		//InputStream in = Test.class.getResourceAsStream("org/mozilla/javascript/tools/Messages.properties");
		InputStream in = Test.class.getClassLoader().
		getResourceAsStream("org/mozilla/javascript/tools/resources/Messages.properties");
		System.out.println(in);
	}

}
