package com.bloodline.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users_order_test")
public class UserOrderTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientName;

    @Column(name = "test_type")
    private String testType;

    private String username;
    private String status;

    @Column(name = "received_date")
    private String receivedDate;

    @Column(name = "appointment_date")
    private String appointmentDate;

    // Thêm các trường khác nếu cần

    // Getters và setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReceivedDate() { return receivedDate; }
    public void setReceivedDate(String receivedDate) { this.receivedDate = receivedDate; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
}
