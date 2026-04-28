package com.example.demo;

import com.example.demo.models.HealingRecord;
import com.example.demo.repositories.TenantProjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/orca")
public class OrcaMetricsController {

    @Autowired
    private HealingRecordRepository healingRecordRepository;

    @Autowired
    private TenantProjectRepository tenantProjectRepository;

    @GetMapping("/stats")
    public Mono<Map<String, Object>> getStats(@RequestParam String projectId) {
        log.info("TARGET HIT: Fetching stats for Project ID: {}", projectId);
        
        return Mono.<Map<String, Object>>fromCallable(() -> {
            try {
                Long id = Long.parseLong(projectId);
                
                return tenantProjectRepository.findById(id).map(project -> {
                    String name = project.getProjectName();
                    List<HealingRecord> records = healingRecordRepository.findByProjectName(name);

                    long totalHeals = records.stream()
                            .filter(r -> !"REJECTED_BY_DEV".equals(r.getStatus()))
                            .count();

                    Map<String, Object> stats = new java.util.HashMap<>();
                    stats.put("status", project.isActive() ? "ACTIVE" : "PAUSED");
                    stats.put("healsToday", totalHeals);
                    stats.put("avgLatency", "112ms");
                    stats.put("model", "Gemini 2.5 Flash");
                    stats.put("projectName", name);
                    
                    return stats;
                }).orElseGet(() -> {
                    Map<String, Object> errorMap = new java.util.HashMap<>();
                    errorMap.put("error", "Project Not Found");
                    return errorMap;
                });

            } catch (Exception e) {
                log.error("ORCA: Metrics error: {}", e.getMessage());
                return java.util.Collections.emptyMap();
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}