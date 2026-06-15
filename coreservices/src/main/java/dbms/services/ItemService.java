package dbms.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import dbms.models.Items;
import dbms.repository.ItemsRepository;
import dbms.util.ApiResponse;

import jakarta.persistence.criteria.Predicate;

@Service
public class ItemService {

    @Autowired
    private ItemsRepository itemRepository;

    @Autowired
    private JwtService jwtService;

    public ApiResponse<Map<String, Object>> search(
            String token,
            String q,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minRating,
            int page,
            int pageSize) {
        try {
            jwtService.validateToken(token);

            int safePage = Math.max(page, 1);
            int safePageSize = Math.min(Math.max(pageSize, 1), 100);

            Specification<Items> spec = buildSpec(q, category, minPrice, maxPrice, minRating);
            PageRequest pageRequest = PageRequest.of(safePage - 1, safePageSize, Sort.by("name").ascending());
            Page<Items> result = itemRepository.findAll(spec, pageRequest);

            List<Map<String, Object>> items = new ArrayList<>();
            for (Items item : result.getContent()) {
                items.add(toItemMap(item));
            }

            Map<String, Object> data = new HashMap<>();
            data.put("items", items);
            data.put("totalCount", result.getTotalElements());
            data.put("totalPages", result.getTotalPages());
            data.put("page", safePage);
            data.put("pageSize", safePageSize);

            return ApiResponse.success(data);
        } catch (Exception e) {
            return ApiResponse.error(401, e.getMessage());
        }
    }

    private Specification<Items> buildSpec(
            String q,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minRating) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)));
            }

            if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minRating != null && minRating.compareTo(BigDecimal.ZERO) > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Map<String, Object> toItemMap(Items item) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", item.getExternalId());
        map.put("name", item.getName());
        map.put("category", item.getCategory());
        map.put("price", item.getPrice());
        map.put("rating", item.getRating());
        map.put("description", item.getDescription());
        map.put("image", item.getImageUrl());
        return map;
    }
}
