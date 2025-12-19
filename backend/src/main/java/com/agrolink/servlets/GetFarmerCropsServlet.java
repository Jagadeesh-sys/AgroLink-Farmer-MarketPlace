package com.agrolink.servlets;

import com.agrolink.dao.CropDAO;
import com.agrolink.model.Crop;
import com.google.gson.Gson;

import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

public class GetFarmerCropsServlet extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        setCors(req, resp);  // allow frontend access

        try {
            String farmerId = req.getParameter("farmerId");

            CropDAO dao = new CropDAO();
            List<Crop> crops = dao.getCropsByFarmer(farmerId);

            String json = new Gson().toJson(crops);
            sendJson(resp, json);

        } catch (Exception e) {
            e.printStackTrace();
            sendJson(resp, "{\"error\":\"Unable to fetch crops\"}");
        }
    }
}