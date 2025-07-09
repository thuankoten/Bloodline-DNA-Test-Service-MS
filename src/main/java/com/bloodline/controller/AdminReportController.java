package com.bloodline.controller;

import org.springframework.web.bind.annotation.*;
import org.json.*;
import java.sql.*;

@RestController
@RequestMapping("/api/admin-report")
public class AdminReportController {

    @GetMapping
    public String getAdminReport() {
        String url = "jdbc:mysql://localhost:3306/bloodline_db";
        String user = "root";
        String pass = "";

        JSONObject result = new JSONObject();
        JSONArray tests = new JSONArray();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(url, user, pass);

            // Tổng số người dùng (distinct username)
            Statement st1 = conn.createStatement();
            ResultSet rs1 = st1.executeQuery("SELECT COUNT(DISTINCT username) FROM users_order_test");
            if (rs1.next()) result.put("totalUsers", rs1.getInt(1));

            // Tổng số xét nghiệm (số dòng)
            Statement st2 = conn.createStatement();
            ResultSet rs2 = st2.executeQuery("SELECT COUNT(*) FROM users_order_test");
            if (rs2.next()) result.put("totalTests", rs2.getInt(1));

            // Tổng doanh thu (chuẩn hóa lấy số tiền từ selected_package_label)
            Statement st3 = conn.createStatement();
            ResultSet rs3 = st3.executeQuery("SELECT selected_package_label FROM users_order_test");
            int totalRevenue = 0;
            while (rs3.next()) {
                String label = rs3.getString("selected_package_label");
                if (label != null && label.contains("-")) {
                    String[] parts = label.split("-");
                    if (parts.length > 1) {
                        // Lấy phần sau dấu '-' (thường là " 4,990,000 VNĐ")
                        String moneyPart = parts[1].trim();
                        // Lấy số tiền bằng regex (chỉ lấy số và dấu phẩy)
                        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("(\\d{1,3}(,\\d{3})*)").matcher(moneyPart);
                        if (matcher.find()) {
                            String moneyStr = matcher.group(1).replace(",", "");
                            try {
                                totalRevenue += Long.parseLong(moneyStr);
                            } catch (NumberFormatException e) {
                                // Bỏ qua nếu lỗi parse
                            }
                        }
                    }
                }
            }
            result.put("totalRevenue", totalRevenue);

            // Danh sách chi tiết
            Statement st4 = conn.createStatement();
            ResultSet rs4 = st4.executeQuery("SELECT id, username, appointment_date, selected_package_label FROM users_order_test");
            while (rs4.next()) {
                JSONObject obj = new JSONObject();
                obj.put("userName", rs4.getString("username"));
                obj.put("testCode", rs4.getInt("id"));
                obj.put("testDate", rs4.getString("appointment_date"));
                obj.put("price", rs4.getString("selected_package_label"));
                tests.put(obj);
            }
            result.put("tests", tests);

            conn.close();
            return result.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }
    
}