package com.example.demo;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
@RestController
@RequestMapping("/api/orca/traffic")
public class TrafficMonitor implements GlobalFilter, Ordered {

    private final ConcurrentLinkedQueue<Map<String, Object>> liveTraffic = new ConcurrentLinkedQueue<>();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();
        
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long latency = System.currentTimeMillis() - startTime;
            int status = exchange.getResponse().getStatusCode() != null ? 
                         exchange.getResponse().getStatusCode().value() : 500;
            String method = exchange.getRequest().getMethod().name();
            String path = exchange.getRequest().getURI().getPath();

            liveTraffic.add(Map.of(
                "timestamp", System.currentTimeMillis(),
                "method", method + " " + path,
                "status", status,
                "latency", latency
            ));

            if (liveTraffic.size() > 100) {
                liveTraffic.poll();
            }
        }));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    @GetMapping
    public List<Map<String, Object>> getLiveTraffic() {
        List<Map<String, Object>> trafficList = new ArrayList<>(liveTraffic);
        Collections.reverse(trafficList);
        return trafficList;
    }
}