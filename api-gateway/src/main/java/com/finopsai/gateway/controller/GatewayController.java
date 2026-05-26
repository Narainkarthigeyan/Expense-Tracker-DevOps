package com.finopsai.gateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Enumeration;

@RestController
public class GatewayController {

    @Value("${gateway.routes.auth-service}")
    private String authServiceUrl;

    @Value("${gateway.routes.expense-service}")
    private String expenseServiceUrl;

    @Value("${gateway.routes.budget-service}")
    private String budgetServiceUrl;

    @Value("${gateway.routes.analytics-service}")
    private String analyticsServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @RequestMapping(value = "/api/auth/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<String> routeAuth(HttpServletRequest request, @RequestBody(required = false) String body) {
        return forward(request, body, authServiceUrl);
    }

    @RequestMapping(value = "/api/expenses/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<String> routeExpenses(HttpServletRequest request, @RequestBody(required = false) String body) {
        return forward(request, body, expenseServiceUrl);
    }

    @RequestMapping(value = "/api/budgets/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<String> routeBudgets(HttpServletRequest request, @RequestBody(required = false) String body) {
        return forward(request, body, budgetServiceUrl);
    }

    @RequestMapping(value = "/api/analytics/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<String> routeAnalytics(HttpServletRequest request, @RequestBody(required = false) String body) {
        return forward(request, body, analyticsServiceUrl);
    }

    private ResponseEntity<String> forward(HttpServletRequest request, String body, String targetBaseUrl) {
        try {
            String path = request.getRequestURI();
            String query = request.getQueryString();

            String targetUrl = targetBaseUrl + path;
            if (query != null) {
                targetUrl += "?" + query;
            }

            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String name = headerNames.nextElement();
                if (!name.equalsIgnoreCase("host") && !name.equalsIgnoreCase("content-length")) {
                    headers.set(name, request.getHeader(name));
                }
            }

            HttpMethod method = HttpMethod.valueOf(request.getMethod());
            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(targetUrl, method, entity, String.class);
            
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            
            return new ResponseEntity<>(response.getBody(), responseHeaders, response.getStatusCode());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\": \"Service unavailable: " + e.getMessage() + "\"}");
        }
    }
}
