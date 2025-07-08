package com.bloodline.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bloodline.entity.OrderTest;
import com.bloodline.repository.OrderTestRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderTestController {

    @Autowired
    private OrderTestRepository orderTestRepository;

    @GetMapping
    public List<OrderTest> getOrdersByUsername(@RequestParam("username") String username) {
        return orderTestRepository.findByUsername(username);
    }

    @GetMapping("/all")
    public List<OrderTest> getAllOrders() {
        return orderTestRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderTest orderTest) {
        OrderTest savedOrder = orderTestRepository.save(orderTest);
        return ResponseEntity.ok(savedOrder);
    }

    @PutMapping("/{id}/sample")
    public ResponseEntity<?> updateSample(@PathVariable(name = "id") Long id, @RequestBody Map<String, String> body) {
        System.out.println(">> PUT /" + id + "/sample");
        System.out.println("Request Body: " + body); // Log đầu vào

        Optional<OrderTest> optional = orderTestRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String sample = body.get("sample");
        if (sample == null || sample.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Mẫu xét nghiệm không được để trống.");
        }

        OrderTest order = optional.get();
        order.setSample(sample);
        // gán trạng thái đang xét nghiệm sau khi chọn mẫu
        if (order.getStatus() == null || order.getStatus().trim().isEmpty()) {
            order.setStatus("0");
        }

        System.out.println("Saving order with new sample: " + sample + " và status: 0");

        OrderTest updated = orderTestRepository.save(order);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable(name = "id") Long id,
            @RequestBody Map<String, String> body) {
        Optional<OrderTest> optional = orderTestRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body("Status không được để trống.");
        }

        OrderTest order = optional.get();
        order.setStatus(status);
        orderTestRepository.save(order);

        return ResponseEntity.ok(order);
    }

    @PostMapping("/conclusion")
    public ResponseEntity<?> saveConclusion(@RequestBody Map<String, String> payload) {
        System.out.println("[DEBUG] Payload nhận được: " + payload);
        try {
            if (!payload.containsKey("id") || !payload.containsKey("conclusion")) {
                return ResponseEntity.badRequest().body("Thiếu id hoặc kết luận.");
            }
            Long id;
            try {
                id = Long.parseLong(payload.get("id"));
            } catch (NumberFormatException nfe) {
                System.out.println("[ERROR] id không hợp lệ: " + payload.get("id"));
                return ResponseEntity.badRequest().body("id không hợp lệ.");
            }
            String conclusion = payload.get("conclusion");
            Optional<OrderTest> optionalOrder = orderTestRepository.findById(id);
            if (optionalOrder.isPresent()) {
                OrderTest order = optionalOrder.get();
                order.setConclusion(conclusion);
                orderTestRepository.save(order);
                return ResponseEntity.ok("Kết luận đã được lưu.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy mẫu.");
            }
        } catch (Exception e) {
            System.out.println("[ERROR] Exception khi lưu kết luận: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xử lý dữ liệu.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long id) {
        Optional<OrderTest> optional = orderTestRepository.findById(id);
        if (optional.isPresent()) {
            OrderTest order = optional.get();
            // Đảm bảo trả về đúng tên trường test_type (snake_case) cho frontend
            Map<String, Object> result = new java.util.HashMap<>();
            result.put("id", order.getId());
            result.put("username", order.getUsername());
            result.put("customerName", order.getCustomerName());
            result.put("appointmentDate", order.getAppointmentDate());
            result.put("receivedDate", order.getReceivedDate());
            result.put("conclusion", order.getConclusion());
            result.put("test_type", order.getTestType());
            // Thêm các trường khác nếu cần
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy kết quả.");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getSampleStats() {
        List<Object[]> results = orderTestRepository.countByStatus();
        Map<String, Integer> stats = new java.util.HashMap<>();

        stats.put("processing", 0);
        stats.put("pending", 0);
        stats.put("completed", 0);

        for (Object[] row : results) {
            String status = String.valueOf(row[0]);
            int count = ((Number) row[1]).intValue();
            switch (status) {
                case "0":
                case "đang xét nghiệm":
                    stats.put("processing", count);
                    break;
                case "1":
                case "chờ kết quả":
                    stats.put("pending", count);
                    break;
                case "2":
                case "đã hoàn thành":
                    stats.put("completed", count);
                    break;
            }
        }

        return ResponseEntity.ok(stats);
    }

}
