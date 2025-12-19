package com.agrolink.servlets;

import com.agrolink.dao.CropDAO;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;

public class DeleteCropServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        setCors(req, resp);

        String cropId = req.getParameter("cropId");
        String images = req.getParameter("images");

        File uploadDir = resolveUploadsDir(req);

        System.out.println("---- DEBUG DELETE ----");
        System.out.println("cropId = " + cropId);
        System.out.println("images = " + images);
        System.out.println("UPLOAD PATH = " + uploadDir.getAbsolutePath());

        if (cropId == null || cropId.trim().isEmpty()) {
            sendJson(resp, "{\"status\":\"FAILED\",\"message\":\"cropId missing\"}");
            return;
        }

        try {
            // ✅ Delete images
            if (images != null && !images.trim().isEmpty()) {
                for (String file : images.split(",")) {
                    file = file.trim();
                    if (file.isEmpty()) continue;

                    File imgFile = new File(uploadDir, file);

                    System.out.println("Deleting: " + imgFile.getAbsolutePath());

                    if (imgFile.exists()) {
                        boolean deleted = imgFile.delete();
                        System.out.println(deleted ? "Deleted file" : "Failed to delete file");
                    } else {
                        System.out.println("File does NOT exist");
                    }
                }
            }

            // ✅ Delete crop from DB
            new CropDAO().deleteCrop(cropId);

            sendJson(resp, "{\"status\":\"SUCCESS\"}");

        } catch (Exception e) {
            e.printStackTrace();
            sendJson(resp, "{\"status\":\"FAILED\"}");
        }
    }
}
