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
    // ...
}
