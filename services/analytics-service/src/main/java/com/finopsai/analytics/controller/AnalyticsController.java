package com.finopsai.analytics.controller;

import com.finopsai.analytics.entity.Expense;
import com.finopsai.analytics.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin("*")
public class AnalyticsController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public Map<String, Object> getAnalytics(@RequestParam Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        Double totalExpenses = expenses.stream().mapToDouble(Expense::getAmount).sum();

        Map<String, Double> categoryBreakdown = expenses.stream()
            .collect(Collectors.groupingBy(Expense::getCategory,
                     Collectors.summingDouble(Expense::getAmount)));

        Map<String, Object> response = new HashMap<>();
        response.put("totalExpenses", totalExpenses);
        response.put("categoryBreakdown", categoryBreakdown);
        response.put("transactionCount", expenses.size());

        return response;
    }

    @GetMapping("/monthly-summary")
    public Map<String, Object> getMonthlySummary(@RequestParam Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        Map<String, Double> monthlyBreakdown = expenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getTransactionDate().getYear() + "-" + String.format("%02d", e.getTransactionDate().getMonthValue()),
                Collectors.summingDouble(Expense::getAmount)));

        Map<String, Object> response = new HashMap<>();
        response.put("monthlyBreakdown", monthlyBreakdown);
        return response;
    }
}
