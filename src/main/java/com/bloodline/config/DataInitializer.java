package com.bloodline.config;

import com.bloodline.entity.User;
import com.bloodline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("Khởi tạo dữ liệu ban đầu...");
        
        createDefaultAccounts();
        
        System.out.println("Hoàn thành khởi tạo dữ liệu");
        System.out.println("Danh sách tài khoản mặc định:");
        System.out.println("Admin: admin@bloodline.com / admin123");
        System.out.println("Manager: manager@bloodline.com / manager123");
        System.out.println("Staff: staff@bloodline.com / staff123");
    }
    
    private void createDefaultAccounts() {
        try {
            // Tạo tài khoản Admin
            if (!userRepository.existsByEmail("admin@bloodline.com")) {
                User admin = new User(
                    "Admin", "System", 
                    "admin@bloodline.com", "0123456789", 
                    "admin", hashPassword("admin123"), "admin"
                );
                userRepository.save(admin);
                System.out.println("Đã tạo tài khoản Admin");
            }

            // Tạo tài khoản Manager
            if (!userRepository.existsByEmail("manager@bloodline.com")) {
                User manager = new User(
                    "Manager", "System", 
                    "manager@bloodline.com", "0987654321", 
                    "manager", hashPassword("manager123"), "manager"
                );
                userRepository.save(manager);
                System.out.println("Đã tạo tài khoản Manager");
            }

            // Tạo tài khoản Staff
            if (!userRepository.existsByEmail("staff@bloodline.com")) {
                User staff = new User(
                    "Staff", "Lab", 
                    "staff@bloodline.com", "0456789123", 
                    "staff", hashPassword("staff123"), "staff"
                );
                userRepository.save(staff);
                System.out.println("Đã tạo tài khoản Staff");
            }

        } catch (Exception e) {
            System.err.println("Lỗi khi tạo tài khoản mặc định: " + e.getMessage());
            e.printStackTrace();
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