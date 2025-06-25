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
    @PutMapping("/{id}/sample")
    public ResponseEntity<?> updateSample(@PathVariable(name = "id") Long id,
                                      @RequestBody Map<String, String> body) {
        Optional<OrderTest> optional = orderTestRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String sample = body.get("sample");
        OrderTest order = optional.get();
        order.setSample(sample);
        order.setStatus("0");
        orderTestRepository.save(order);

        return ResponseEntity.ok(order);
    }


}
