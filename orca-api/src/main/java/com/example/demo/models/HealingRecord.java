package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class HealingRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;
    private String endpoint;
    private String projectName; 
    private String status = "AUTO_PATCHED"; 
    
    @Column(columnDefinition = "TEXT")
    private String detectedDrift;
    
    @Column(columnDefinition = "TEXT")
    private String healedPayload;
}