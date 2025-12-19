package com.agrolink.servlets;

import com.agrolink.dao.CropDAO;
import com.agrolink.model.Crop;

import javax.servlet.http.*;
import javax.servlet.annotation.MultipartConfig;
import java.io.File;
import java.io.IOException;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 20
)
public class UpdateCropServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        setCors(req, resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            String cropId = req.getParameter("cropId");

            CropDAO dao = new CropDAO();
            Crop crop = dao.getCropById(cropId);

            if (crop == null) {
                sendJson(resp,
                        "{\"status\":\"FAILED\",\"message\":\"Crop not found\"}");
                return;
            }

            crop.setCropName(req.getParameter("cropName"));
            crop.setCategory(req.getParameter("category"));
            crop.setQuantity(req.getParameter("quantity"));
            crop.setPrice(req.getParameter("price"));
            crop.setDescription(req.getParameter("description"));

            File uploadDir = resolveUploadsDir(req);

            StringBuilder newImages = new StringBuilder();

            for (Part part : req.getParts()) {
                if (!"images".equals(part.getName())) continue;
                if (part.getSize() == 0) continue;

                String original = part.getSubmittedFileName();
                if (original == null || original.trim().isEmpty()) continue;

                String safeName = original
                        .replaceAll("[^a-zA-Z0-9._-]", "_");

                String fileName = System.currentTimeMillis() + "_" + safeName;

                part.write(new File(uploadDir, fileName).getAbsolutePath());
                newImages.append(fileName).append(",");
            }

            // Update images only if new ones were uploaded
            if (newImages.length() > 0) {
                crop.setImages(newImages.toString());
            }

            dao.updateCrop(crop);

            sendJson(resp, "{\"status\":\"SUCCESS\"}");

        } catch (Exception e) {
            e.printStackTrace();
            sendJson(resp, "{\"status\":\"FAILED\"}");
        }
    }
}
