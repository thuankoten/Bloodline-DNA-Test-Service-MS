package com.bloodline.controller;

import com.bloodline.entity.UserOrderTest;
import com.bloodline.repository.UserOrderTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-order-tests")
public class UserOrderTestController {

    @Autowired
    private UserOrderTestRepository userOrderTestRepository;

    @GetMapping
    public List<UserOrderTest> getAll() {
        return userOrderTestRepository.findAll();
    }
    @GetMapping("/by-username/{username}")
    public List<UserOrderTest> getByUsername(@PathVariable("username") String username) {
        return userOrderTestRepository.findByUsername(username);
    }
}
