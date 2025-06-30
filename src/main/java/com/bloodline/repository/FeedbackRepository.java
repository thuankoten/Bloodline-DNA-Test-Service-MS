package com.bloodline.repository;

import java.util.List;
import com.bloodline.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCustomerName(String customerName);
    List<Feedback> findByReplyIsNull();
}
