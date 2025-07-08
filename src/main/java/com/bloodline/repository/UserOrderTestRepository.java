package com.bloodline.repository;

import com.bloodline.entity.UserOrderTest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserOrderTestRepository extends JpaRepository<UserOrderTest, Long> {
    List<UserOrderTest> findByUsername(String username);
}
