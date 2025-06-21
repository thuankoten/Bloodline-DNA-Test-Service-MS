package com.bloodline.controller;

import com.bloodline.entity.User;
import com.bloodline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody String body) {
        System.out.println("[UserController] Nhận yêu cầu đăng ký");

        JSONObject jsonResponse = new JSONObject();

        try {
            JSONObject jsonRequest = new JSONObject(body);

            String firstName = jsonRequest.optString("firstName", null);
            String lastName = jsonRequest.optString("lastName", null);
            String email = jsonRequest.optString("email", null); // <-- Đã sửa lại đúng tên trường
            String phone = jsonRequest.optString("phone", null);
            String username = jsonRequest.optString("username", null);
            String password = jsonRequest.optString("password", null);

            // Kiểm tra thiếu dữ liệu
            if (firstName == null || firstName.trim().isEmpty() ||
                lastName == null || lastName.trim().isEmpty() ||
                email == null || email.trim().isEmpty() ||
                username == null || username.trim().isEmpty() ||
                password == null || password.trim().isEmpty()) {

                return jsonResponse.put("success", false)
                                   .put("message", "Vui lòng điền đầy đủ thông tin bắt buộc.")
                                   .toString();
            }

            // Kiểm tra trùng lặp
            if (userRepository.existsByEmail(email)) {
                return jsonResponse.put("success", false)
                                   .put("message", "Email đã được sử dụng!")
                                   .toString();
            }

            if (userRepository.existsByUsername(username)) {
                return jsonResponse.put("success", false)
                                   .put("message", "Tên đăng nhập đã được sử dụng!")
                                   .toString();
            }

            if (phone != null && !phone.trim().isEmpty() && userRepository.existsByPhone(phone)) {
                return jsonResponse.put("success", false)
                                   .put("message", "Số điện thoại đã được sử dụng!")
                                   .toString();
            }

            // Tạo user mới
            User user = new User(firstName, lastName, email, phone, username, hashPassword(password));
            userRepository.save(user);

            return jsonResponse.put("success", true)
                               .put("message", "Đăng ký thành công!")
                               .toString();

        } catch (Exception e) {
            e.printStackTrace();
            return jsonResponse.put("success", false)
                               .put("message", "Lỗi hệ thống: " + e.getMessage())
                               .toString();
        }
    }

    private String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(encodedHash);
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
