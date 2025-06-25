package com.bloodline.controller;

import com.bloodline.entity.Feedback;
import com.bloodline.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*") // Cho phép frontend truy cập
public class FeedbackController {
    @Autowired
    private FeedbackRepository feedbackRepository;

    // Lưu feedback
    @PostMapping("/submit")
    public String submitFeedback(@RequestBody Feedback feedback) {
        feedbackRepository.save(feedback);
        return "Gửi đánh giá thành công!";
    }

    // Lấy tất cả feedback (cho Manager)
    @GetMapping("/all")
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // Xóa feedback
    @DeleteMapping("/delete/{id}")
    public String deleteFeedback(@PathVariable Long id) {
        feedbackRepository.deleteById(id);
        return "Xóa feedback thành công!";
    }
}
