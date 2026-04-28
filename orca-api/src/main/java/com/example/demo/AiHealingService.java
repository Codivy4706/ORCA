package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AiHealingService {

    private final ChatClient chatClient;

    public AiHealingService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String getHealedMapping(String brokenJson, String missingFields) {
        String prompt = """
            You are a strict JSON mapping API.
            Expected fields: %s
            Actual JSON: %s
            
            Map missing fields to semantic equivalents. If no match, use null.
            CRITICAL: Return ONLY raw, valid JSON. No markdown formatting. No conversational text.
            """.formatted(missingFields, brokenJson);

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content()
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();
        } catch (Exception e) {
            return "{\"error\": \"AI service unavailable\"}";
        }
    }
}