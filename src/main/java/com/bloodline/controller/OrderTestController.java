package com.bloodline.controller;

import com.bloodline.entity.OrderTest;
import com.bloodline.repository.OrderTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

}
