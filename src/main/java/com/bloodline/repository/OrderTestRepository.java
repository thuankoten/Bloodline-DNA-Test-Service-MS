package com.bloodline.repository;

import com.bloodline.entity.OrderTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderTestRepository extends JpaRepository<OrderTest, Long> {
    List<OrderTest> findByUsername(String username);

    @Query("SELECT o.status, COUNT(o) FROM OrderTest o GROUP BY o.status")
    List<Object[]> countByStatus();
}
