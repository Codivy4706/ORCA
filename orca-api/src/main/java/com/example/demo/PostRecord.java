package com.example.demo;


/**
 * This is the 'Target Schema'. 
 * If the API returns 'userID' instead of 'userId', 
 * ORCA will detect the drift.
 */
public record PostRecord(
    Integer userId,
    Integer id,
    String title,
    String body
) {}