package com.bloodline.repository;

import com.bloodline.entity.OrderTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderTestRepository extends JpaRepository<OrderTest, Long> {
    List<OrderTest> findByUsername(String username);
}
