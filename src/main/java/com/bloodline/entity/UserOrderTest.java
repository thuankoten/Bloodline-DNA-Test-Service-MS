package com.bloodline.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users_order_test")
public class UserOrderTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    
    @Column(name = "recipient_address")
    private String recipientAddress;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "appointment_date")
    private String appointmentDate;

    @Column(name = "appointment_time")
    private String appointmentTime;

    @Column(name = "selected_package_label")
    private String selectedPackageLabel;

    @Column(name = "test_type")
    private String testType;

    @Column(name = "sample")
    private String sample;

    private String username;
    private String status;

    @Column(name = "received_date")
    private String receivedDate;

    @Column(name = "conclusion")
    private String conclusion;

    // Getters và setters cho tất cả các trường trên
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getRecipientAddress() { return recipientAddress; }
    public void setRecipientAddress(String recipientAddress) { this.recipientAddress = recipientAddress; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getSelectedPackageLabel() { return selectedPackageLabel; }
    public void setSelectedPackageLabel(String selectedPackageLabel) { this.selectedPackageLabel = selectedPackageLabel; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public String getSample() { return sample; }
    public void setSample(String sample) { this.sample = sample; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReceivedDate() { return receivedDate; }
    public void setReceivedDate(String receivedDate) { this.receivedDate = receivedDate; }

    public String getConclusion() { return conclusion; }
    public void setConclusion(String conclusion) { this.conclusion = conclusion; }
}
