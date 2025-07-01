package com.bloodline.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "admin_report")
public class AdminReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String role;

    private LocalDate report_date;
    private Integer report_value;

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDate getReport_date() {
        return report_date;
    }

    public void setReport_date(LocalDate report_date) {
        this.report_date = report_date;
    }

    public Integer getReport_value() {
        return report_value;
    }

    public void setReport_value(Integer report_value) {
        this.report_value = report_value;
    }
}
