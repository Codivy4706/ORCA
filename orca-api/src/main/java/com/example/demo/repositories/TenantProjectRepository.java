package com.example.demo.repositories;

import com.example.demo.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TenantProjectRepository extends JpaRepository<TenantProject, Long> {
    Optional<TenantProject> findByApiKey(String apiKey);
    List<TenantProject> findByUserId(Long ownerId);
}