import java.io.File;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Map;
import java.util.Vector;

public class JavaScript {

	public static void main(String[] args) throws Exception {
		
		//定位JS库的目录, 有些系统的当前目录不是程序运行的目录。需要使用环境变量来定位.
		String jsHome = System.getenv("JS_HOME");
		File libRoot = null;
		
		if (jsHome == null) jsHome = System.getProperty("JS_HOME", "..");
		libRoot = new File(new File(jsHome), "lib");
		
		Vector<URL> libs = new Vector<URL>();
		if (!libRoot.isDirectory()){
			System.out.println("JS_HOME=" + jsHome);
			System.out.println("Not found library diectory, " + 
								libRoot.getAbsolutePath());
			System.exit(-1);
		}
		for (File lib : libRoot.listFiles()) {
			if (lib.getName().endsWith(".jar")) {
				try {
					libs.add(lib.toURI().toURL());
				} catch (MalformedURLException e) {
					e.printStackTrace();
				}
			}
		}
        ClassLoader cl = new URLClassLoader(libs.toArray(new URL[] {}),
                Thread.currentThread().getContextClassLoader());
        Thread.currentThread().setContextClassLoader(cl);
        Class js = cl.loadClass("org.javascript.standalone.shell.Main");
        //js.getMethod('', arg1)
        Method mainMethod = js.getMethod("main", args.getClass());
        mainMethod.invoke(null, new Object[]{args});
	}

}
