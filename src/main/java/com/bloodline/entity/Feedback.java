package com.bloodline.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity

public class Feedback {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private int rating;

    @Column(length = 1000)
    private String feedback;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getter & Setter
    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public int getRating() {
        return rating;
    }

    public String getFeedback() {
        return feedback;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
