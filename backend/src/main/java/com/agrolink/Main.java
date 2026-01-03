package com.agrolink;

import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.Context;
import org.apache.catalina.Wrapper;
import org.apache.catalina.valves.RemoteIpValve;
import org.apache.tomcat.util.http.Rfc6265CookieProcessor;

import com.agrolink.servlets.*;

import java.io.File;
import javax.servlet.MultipartConfigElement;
import javax.servlet.http.HttpServlet;

public class Main {

    public static void main(String[] args) throws Exception {

        // ✅ Railway provides PORT automatically
        int port = Integer.parseInt(
                System.getenv().getOrDefault("PORT", "8080")
        );

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.setBaseDir(new File(System.getProperty("java.io.tmpdir"), "tomcat").getAbsolutePath());

        // ⭐ REQUIRED to initialize connector
        tomcat.getConnector();

        File tempDir = new File(System.getProperty("java.io.tmpdir"), "tomcat");
        if (!tempDir.exists()) {
            tempDir.mkdirs();
        }

        Context context = tomcat.addContext("", tempDir.getAbsolutePath());
        boolean production = isProduction();
        context.getServletContext().getSessionCookieConfig().setHttpOnly(true);
        if (production) {
            context.getServletContext().getSessionCookieConfig().setSecure(true);
            Rfc6265CookieProcessor cookieProcessor = new Rfc6265CookieProcessor();
            cookieProcessor.setSameSiteCookies("None");
            context.setCookieProcessor(cookieProcessor);
        }

        RemoteIpValve remoteIpValve = new RemoteIpValve();
        remoteIpValve.setRemoteIpHeader("x-forwarded-for");
        remoteIpValve.setProtocolHeader("x-forwarded-proto");
        remoteIpValve.setProtocolHeaderHttpsValue("https");
        tomcat.getEngine().getPipeline().addValve(remoteIpValve);

        String multipartTmp = new File(System.getProperty("java.io.tmpdir"), "multipart").getAbsolutePath();
        new File(multipartTmp).mkdirs();

        addServlet(context, "HealthServlet", new HealthServlet(), "/api/health");
        addServlet(context, "SignupServlet", new SignupServlet(), "/api/auth/signup");
        addServlet(context, "LoginServlet", new LoginServlet(), "/api/auth/login");
        addServlet(context, "LogoutServlet", new LogoutServlet(), "/api/auth/logout");

        addServlet(context, "GetProfileServlet", new GetProfileServlet(), "/api/user/get-profile");
        Wrapper updateProfile = addServlet(context, "UpdateProfileServlet", new UpdateProfileServlet(), "/api/user/update-profile");
        updateProfile.setMultipartConfigElement(new MultipartConfigElement(
                multipartTmp,
                10L * 1024 * 1024,
                20L * 1024 * 1024,
                1024 * 1024
        ));

        Wrapper sellingCrop = addServlet(context, "SellingCropServlet", new SellingCropServlet(), "/api/crop/sellingcrop");
        sellingCrop.setMultipartConfigElement(new MultipartConfigElement(
                multipartTmp,
                5L * 1024 * 1024,
                20L * 1024 * 1024,
                1024 * 1024
        ));

        addServlet(context, "GetFarmerCropsServlet", new GetFarmerCropsServlet(), "/api/crop/farmer");
        addServlet(context, "DeleteCropServlet", new DeleteCropServlet(), "/api/crop/delete");
        addServlet(context, "GetAllCropsServlet", new GetAllCropsServlet(), "/api/crop/all");

        Wrapper loanApply = addServlet(context, "LoanApplyServlet", new LoanApplyServlet(), "/api/loan/apply");
        loanApply.setMultipartConfigElement(new MultipartConfigElement(
                multipartTmp,
                5L * 1024 * 1024,
                20L * 1024 * 1024,
                1024 * 1024
        ));

        Wrapper insuranceApply = addServlet(context, "InsuranceApplyServlet", new InsuranceApplyServlet(), "/api/insurance/apply");
        insuranceApply.setMultipartConfigElement(new MultipartConfigElement(
                multipartTmp,
                15L * 1024 * 1024,
                50L * 1024 * 1024,
                2 * 1024 * 1024
        ));

        addServlet(context, "AdminDashboardServlet", new AdminDashboardServlet(), "/api/admin/dashboard");
        addServlet(context, "UploadsServlet", new UploadsServlet(), "/uploads/*");
        addServlet(context, "SpaServlet", new SpaServlet(), "/");

        System.out.println("🚀 AgroLink Backend started on port " + port);

        tomcat.start();
        tomcat.getServer().await();
    }

    private static Wrapper addServlet(Context context, String name, HttpServlet servlet, String mapping) {
        Wrapper wrapper = Tomcat.addServlet(context, name, servlet);
        wrapper.setLoadOnStartup(1);
        context.addServletMappingDecoded(mapping, name);
        return wrapper;
    }

    private static boolean isProduction() {
        String nodeEnv = System.getenv("NODE_ENV");
        if (nodeEnv != null && nodeEnv.trim().equalsIgnoreCase("production")) return true;
        String env = System.getenv("APP_ENV");
        if (env != null && env.trim().equalsIgnoreCase("production")) return true;
        return System.getenv("RAILWAY_ENVIRONMENT") != null || System.getenv("RAILWAY_PROJECT_ID") != null;
    }
}
