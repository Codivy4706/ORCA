package com.example.demo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class PatchCacheManager {

    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public String getCachedPatch(String errorSignature) {
        return cache.get(errorSignature);
    }

    public void savePatch(String errorSignature, String patchJson) {
        log.info("ORCA: Saving AI Patch to high-speed cache for future requests.");
        cache.put(errorSignature, patchJson);
    }
    
    // If the dev clicks "Revert" on the dashboard, we must clear the cache so the AI can try again!
    public void invalidatePatch(String errorSignature) {
        cache.remove(errorSignature);
    }
}