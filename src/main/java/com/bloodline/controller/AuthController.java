package com.bloodline.controller;

import com.bloodline.entity.User;
import com.bloodline.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public String login(@RequestBody String body, HttpSession session) {
        System.out.println("[AuthController] Bắt đầu xử lý đăng nhập");

        JSONObject jsonResponse = new JSONObject();

        try {
            JSONObject jsonRequest = new JSONObject(body);
            String email = jsonRequest.optString("email", null);
            String password = jsonRequest.optString("password", null);

            if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                return jsonResponse.put("success", false)
                                   .put("message", "Email và mật khẩu không được để trống")
                                   .toString();
            }

            String hashedPassword = hashPassword(password);

            User user = userRepository.findByEmailAndPassword(email, hashedPassword);

            if (user != null) {
                // Lưu session
                session.setAttribute("userId", user.getId());
                session.setAttribute("email", user.getEmail());
                session.setAttribute("username", user.getUsername());

                JSONObject userJson = new JSONObject()
                        .put("id", user.getId())
                        .put("email", user.getEmail())
                        .put("username", user.getUsername());

                return jsonResponse.put("success", true)
                                   .put("message", "Đăng nhập thành công")
                                   .put("user", userJson)
                                   .toString();
            } else {
                return jsonResponse.put("success", false)
                                   .put("message", "Email hoặc mật khẩu không đúng")
                                   .toString();
            }
        } catch (NoSuchAlgorithmException e) {
            return jsonResponse.put("success", false)
                               .put("message", "Lỗi hệ thống: Không thể hash mật khẩu")
                               .toString();
        } catch (Exception e) {
            e.printStackTrace();
            return jsonResponse.put("success", false)
                               .put("message", "Đã xảy ra lỗi hệ thống: " + e.getMessage())
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
