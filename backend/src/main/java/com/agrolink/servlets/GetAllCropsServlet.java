package com.agrolink.servlets;

import com.agrolink.dao.CropDAO;
import com.agrolink.model.Crop;
import com.google.gson.Gson;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

public class GetAllCropsServlet extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        setCors(req, resp);

        try {
            List<Crop> crops = new CropDAO().getAllCrops();
            sendJson(resp, new Gson().toJson(crops));
        } catch (Exception e) {
            e.printStackTrace();
            sendJson(resp, "[]");
        }
    }
}