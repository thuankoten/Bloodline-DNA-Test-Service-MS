package com.bloodline.controller;

import com.bloodline.entity.Feedback;
import com.bloodline.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    static class ReplyRequest {
        private String reply;

        public String getReply() {
            return reply;
        }

        public void setReply(String reply) {
            this.reply = reply;
        }
    }

    @PostMapping("/submit")
    public String submitFeedback(@RequestBody Feedback feedback) {
        feedbackRepository.save(feedback);
        return "Gửi đánh giá thành công!";
    }

    @GetMapping("/all")
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findByReplyIsNull();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFeedback(@PathVariable Long id) {
        feedbackRepository.deleteById(id);
        return "Xóa feedback thành công!";
    }

    @GetMapping("/user")
    public List<Feedback> getFeedbackByUsername(@RequestParam("username") String username) {
        return feedbackRepository.findByCustomerName(username);
    }

    @PostMapping("/reply/{id}")
    public String replyToFeedback(@PathVariable("id") Long id, @RequestBody ReplyRequest request) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback không tồn tại"));
        feedback.setReply(request.getReply());
        feedbackRepository.save(feedback);
        return "Phản hồi thành công!";
    }
}
