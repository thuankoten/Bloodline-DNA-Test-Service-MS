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
@CrossOrigin(origins = "*")
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
            String selectedRole = jsonRequest.optString("selectedRole", "customer"); 

            if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                return jsonResponse.put("success", false)
                                   .put("message", "Email và mật khẩu không được để trống")
                                   .toString();
            }

            String hashedPassword = hashPassword(password);

           
            User user = userRepository.findByEmailAndPasswordAndActive(email, hashedPassword, true);

            if (user != null) {
         
                if (!selectedRole.equals("customer")) {
                    if (!user.getRole().equals(selectedRole)) {
                        return jsonResponse.put("success", false)
                                          .put("message", "Bạn không có quyền truy cập với vai trò này")
                                          .toString();
                    }
                }

                // Lưu session
                session.setAttribute("userId", user.getId());
                session.setAttribute("email", user.getEmail());
                session.setAttribute("username", user.getUsername());
                session.setAttribute("role", user.getRole());

                JSONObject userJson = new JSONObject()
                        .put("id", user.getId())
                        .put("email", user.getEmail())
                        .put("username", user.getUsername())
                        .put("fullName", user.getFullName())
                        .put("role", user.getRole());

              
                String redirectPage = getRedirectPage(user.getRole());

                return jsonResponse.put("success", true)
                                   .put("message", "Đăng nhập thành công")
                                   .put("user", userJson)
                                   .put("redirectPage", redirectPage)
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

    private String getRedirectPage(String role) {
        switch (role.toLowerCase()) {
            case "admin":
                return "admin-dashboard.html";
            case "manager":
                return "manager-dashboard.html";
            case "staff":
                return "staff-dashboard.html";
            default:
                return "dashboard.html";
        }
    }

    
    @PostMapping("/create-default-accounts")
    public String createDefaultAccounts() {
        JSONObject jsonResponse = new JSONObject();
        
        try {
            // Tạo tài khoản Admin
            if (!userRepository.existsByEmail("admin@bloodline.com")) {
                User admin = new User(
                    "Admin", "System", 
                    "admin@bloodline.com", "0123456789", 
                    "admin", hashPassword("admin123"), "admin"
                );
                userRepository.save(admin);
                System.out.println("Đã tạo tài khoản Admin: admin@bloodline.com / admin123");
            }

            // Tạo tài khoản Manager
            if (!userRepository.existsByEmail("manager@bloodline.com")) {
                User manager = new User(
                    "Manager", "System", 
                    "manager@bloodline.com", "0987654321", 
                    "manager", hashPassword("manager123"), "manager"
                );
                userRepository.save(manager);
                System.out.println("Đã tạo tài khoản Manager: manager@bloodline.com / manager123");
            }

            // Tạo tài khoản Staff
            if (!userRepository.existsByEmail("staff@bloodline.com")) {
                User staff = new User(
                    "Staff", "Lab", 
                    "staff@bloodline.com", "0456789123", 
                    "staff", hashPassword("staff123"), "staff"
                );
                userRepository.save(staff);
                System.out.println("Đã tạo tài khoản Staff: staff@bloodline.com / staff123");
            }

            return jsonResponse.put("success", true)
                               .put("message", "Đã tạo các tài khoản mặc định thành công")
                               .toString();

        } catch (Exception e) {
            e.printStackTrace();
            return jsonResponse.put("success", false)
                               .put("message", "Lỗi khi tạo tài khoản mặc định: " + e.getMessage())
                               .toString();
        }
    }

    // Endpoint để kiểm tra trạng thái server
    @GetMapping("/status")
    public String getStatus() {
        JSONObject jsonResponse = new JSONObject();
        return jsonResponse.put("status", "Server đang hoạt động")
                           .put("timestamp", System.currentTimeMillis())
                           .toString();
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