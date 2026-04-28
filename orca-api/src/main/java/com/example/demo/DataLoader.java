package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.models.TenantProject;
import com.example.demo.repositories.TenantProjectRepository;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepo, TenantProjectRepository tenantRepo) {
        return args -> {
            
            if (tenantRepo.findByApiKey("orca_live_99xyz").isEmpty()) {
                TenantProject demoProject = new TenantProject();
                demoProject.setProjectName("Mentor Demo Workspace");
                demoProject.setApiKey("orca_live_99xyz"); 
                
                tenantRepo.save(demoProject);
                log.info("ORCA: Generated Root API Key for testing: orca_live_99xyz");
            }

            if (userRepo.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("orca2026"); 
                admin.setRole("ROLE_ADMIN");
                
                userRepo.save(admin);
                log.info("ORCA: Admin user created -> Username: admin | Password: orca2026");
            }
        };
    }
}