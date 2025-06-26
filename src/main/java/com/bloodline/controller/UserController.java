package com.bloodline.controller;

import com.bloodline.entity.User;
import com.bloodline.repository.UserRepository;
import com.bloodline.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
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
            String email = jsonRequest.optString("email", null);
            String phone = jsonRequest.optString("phone", null);
            String username = jsonRequest.optString("username", null);
            String password = jsonRequest.optString("password", null);

            if (firstName == null || firstName.trim().isEmpty() ||
                lastName == null || lastName.trim().isEmpty() ||
                email == null || email.trim().isEmpty() ||
                username == null || username.trim().isEmpty() ||
                password == null || password.trim().isEmpty()) {

                return jsonResponse.put("success", false)
                                   .put("message", "Vui lòng điền đầy đủ thông tin bắt buộc.")
                                   .toString();
            }

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

    @GetMapping("/user")
    public String getUserInfo(@RequestParam("username") String username) {
        JSONObject response = new JSONObject();

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Không tìm thấy người dùng.");
            } else {
                JSONObject userData = new JSONObject();
                userData.put("fullName", user.getFirstName() + " " + user.getLastName());
                userData.put("email", user.getEmail());
                userData.put("phone", user.getPhone());

                response.put("success", true);
                response.put("user", userData);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi hệ thống: " + e.getMessage());
        }

        return response.toString();
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

    @PostMapping("/change-password")
    public String changePassword(@RequestBody String body) {
    JSONObject response = new JSONObject();

    try {
        JSONObject json = new JSONObject(body);
        String username = json.optString("username");
        String newPassword = json.optString("newPassword");

        if (username == null || username.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return response.put("success", false)
                           .put("message", "Thiếu thông tin.").toString();
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return response.put("success", false)
                           .put("message", "Không tìm thấy người dùng.").toString();
        }

        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);

        return response.put("success", true)
                       .put("message", "Đổi mật khẩu thành công.").toString();

    } catch (Exception e) {
        e.printStackTrace();
        return response.put("success", false)
                       .put("message", "Lỗi hệ thống: " + e.getMessage()).toString();
    }
}
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User user) {
        user.setId(id);
        return userService.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }
}
