package com.agrolink.servlets;

import com.agrolink.dao.CropDAO;
import com.agrolink.model.Crop;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Collection;
import java.util.UUID;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 20
)
public class SellingCropServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException {

        try {
            setCors(request, response);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            File uploadDir = resolveUploadsDir(request);

            // 🔹 Form fields
            String farmerId = request.getParameter("farmerId");
            String cropName = request.getParameter("cropName");
            String category = request.getParameter("category");
            String quantity = request.getParameter("quantity");
            String price = request.getParameter("price");
            String deliveryTime = request.getParameter("deliveryTime");
            String grade = request.getParameter("grade");
            String description = request.getParameter("description");

            StringBuilder imageUrls = new StringBuilder();

            // 🔹 Handle image uploads
            Collection<Part> parts = request.getParts();
            for (Part part : parts) {

                if (!"images".equals(part.getName())) continue;
                if (part.getSize() == 0) continue;

                // ✅ Unique filename
                String fileName = UUID.randomUUID() + "_" + part.getSubmittedFileName();
                File file = new File(uploadDir, fileName);

                try (InputStream is = part.getInputStream();
                     FileOutputStream fos = new FileOutputStream(file)) {

                    byte[] buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = is.read(buffer)) != -1) {
                        fos.write(buffer, 0, bytesRead);
                    }
                }

                // ✅ Store RELATIVE URL (important for frontend)
                imageUrls.append("uploads/").append(fileName).append(",");
            }

            // 🔹 Save crop
            CropDAO dao = new CropDAO();
            Crop crop = new Crop();

            String cropId = dao.generateCropId(farmerId);

            crop.setCropId(cropId);
            crop.setFarmerId(farmerId);
            crop.setCropName(cropName);
            crop.setCategory(category);
            crop.setQuantity(quantity);
            crop.setPrice(price);
            crop.setDeliveryTime(deliveryTime);
            crop.setGrade(grade);
            crop.setDescription(description);

            // ✅ Store local image paths
            crop.setImages(imageUrls.toString());

            dao.saveCrop(crop);

            response.getWriter().write("{\"status\":\"SUCCESS\"}");

        } catch (Exception e) {
            e.printStackTrace();
            try {
                response.getWriter().write("{\"status\":\"FAILED\"}");
            } catch (Exception ignored) {}
        }
    }
}
