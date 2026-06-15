package dbms.config;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import dbms.models.Items;
import dbms.models.Roles;
import dbms.repository.ItemsRepository;
import dbms.repository.RolesRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolesRepository rolesRepository;
    private final ItemsRepository itemsRepository;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(RolesRepository rolesRepository,
            ItemsRepository itemsRepository,
            JdbcTemplate jdbcTemplate) {
        this.rolesRepository = rolesRepository;
        this.itemsRepository = itemsRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        alignUsersTable();
        seedRoles();
        seedItems();
    }

    private void alignUsersTable() {
        try {
            jdbcTemplate.update("DELETE FROM users WHERE password LIKE '$2%'");
            jdbcTemplate.update("DELETE FROM users WHERE LOWER(email) = ?", "admin@example.com");

            List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                    "SELECT column_name FROM information_schema.columns "
                            + "WHERE table_schema = 'public' AND table_name = 'users'");

            for (Map<String, Object> row : columns) {
                String column = row.get("column_name").toString();
                if ("created_at".equalsIgnoreCase(column) || "enabled".equalsIgnoreCase(column)) {
                    jdbcTemplate.execute("ALTER TABLE users DROP COLUMN \"" + column + "\"");
                }
            }
        } catch (Exception ignored) {
            // users table may not exist yet on first run
        }
    }

    private void seedRoles() {
        if (rolesRepository.count() == 0) {
            Roles admin = new Roles();
            admin.setName("ADMIN");
            rolesRepository.save(admin);

            Roles user = new Roles();
            user.setName("USER");
            rolesRepository.save(user);
        }
    }

    private void seedItems() {
        if (itemsRepository.count() > 0) {
            return;
        }

        Object[][] catalog = {
                {"b1", "The Art of React", "Books", "29.99", "4.7", "A practical guide to building modern UIs with React.", "/assets/book1.jpeg"},
                {"b2", "JavaScript Basics", "Books", "19.99", "4.3", "Beginner-friendly introduction to core JavaScript concepts.", "/assets/book2.jpeg"},
                {"b3", "CSS for Designers", "Books", "24.99", "4.1", "Styling and layout techniques for beautiful web interfaces.", "/assets/book3.jpeg"},
                {"b4", "Advanced TypeScript", "Books", "34.99", "4.8", "Deep dive into TypeScript type system and patterns.", "/assets/book4.jpg"},
                {"b5", "Clean Code Practices", "Books", "27.50", "4.9", "Principles and patterns for writing maintainable code.", "/assets/book5.jpg"},
                {"b6", "Algorithms Made Simple", "Books", "31.00", "4.4", "A gentle introduction to algorithms and problem solving.", "/assets/book6.jpg"},
                {"b7", "Data Structures in Depth", "Books", "33.50", "4.5", "Learn how to use and implement core data structures.", "/assets/book7.jpeg"},
                {"b8", "UI/UX Design Guide", "Books", "26.00", "4.2", "Foundations of user interface and user experience design.", "/assets/book8.jpg"},
                {"b9", "Full-Stack Web Development", "Books", "38.00", "4.6", "End-to-end web app development using modern tools.", "/assets/book9.jpg"},
                {"b10", "Database Essentials", "Books", "22.50", "4.0", "Core concepts of relational and NoSQL databases.", "/assets/book10.png"},
                {"e1", "Noise-Cancelling Headphones", "Electronics", "199.99", "4.6", "Over-ear headphones with active noise cancellation.", "/assets/electronics1.webp"},
                {"e2", "4K Monitor 27\"", "Electronics", "329.99", "4.4", "Crystal-clear 4K display for work and gaming.", "/assets/electronics2.webp"},
                {"e3", "Wireless Keyboard", "Electronics", "59.99", "4.2", "Compact keyboard with long-lasting battery life.", "/assets/electronics3.webp"},
                {"e4", "Smartphone Pro Max", "Electronics", "999.00", "4.9", "High-end smartphone with excellent camera and battery.", "/assets/electronics4.webp"},
                {"e5", "Bluetooth Speaker", "Electronics", "89.50", "4.0", "Portable speaker with rich sound and deep bass.", "/assets/electronics5.webp"},
                {"e6", "USB-C Hub", "Electronics", "39.99", "3.9", "Multi-port hub for laptops and tablets.", "/assets/electronics6.webp"},
                {"c1", "Classic White T-Shirt", "Clothing", "14.99", "4.1", "Soft cotton t-shirt with a regular fit.", "/assets/clothing1.jpg"},
                {"c2", "Blue Denim Jeans", "Clothing", "49.99", "4.5", "Slim fit jeans suitable for everyday wear.", "/assets/clothing2.webp"},
                {"c3", "Hooded Sweatshirt", "Clothing", "39.99", "4.3", "Cozy hoodie for cool weather.", "/assets/clothing3.webp"},
                {"c4", "Running Shoes", "Clothing", "89.99", "4.6", "Lightweight running shoes with great cushioning.", "/assets/clothing4.webp"},
                {"c5", "Formal Blazer", "Clothing", "119.99", "4.7", "Tailored blazer for professional settings.", "/assets/clothing5.webp"},
                {"c6", "Summer Dress", "Clothing", "59.00", "4.2", "Light and airy dress perfect for summer.", "/assets/clothing6.webp"},
                {"c7", "Oversized Hoodie", "Clothing", "42.00", "4.3", "Casual oversized hoodie for everyday comfort.", "/assets/clothing7.webp"},
                {"c8", "Black Trousers", "Clothing", "54.00", "4.4", "Straight-fit black trousers for formal occasions.", "/assets/clothing8.webp"},
                {"c9", "Checked Shirt", "Clothing", "29.00", "4.1", "Button-up shirt with a classic checked pattern.", "/assets/clothing9.webp"},
                {"c10", "Sports Jacket", "Clothing", "99.00", "4.5", "Lightweight jacket suitable for outdoor activities.", "/assets/clothing10.webp"},
                {"c11", "Winter Coat", "Clothing", "139.00", "4.6", "Warm coat designed for cold weather.", "/assets/clothing11.webp"},
                {"c12", "Casual Sneakers", "Clothing", "79.00", "4.4", "Comfortable sneakers for daily wear.", "/assets/clothing12.webp"},
        };

        for (Object[] row : catalog) {
            Items item = new Items();
            item.setExternalId((String) row[0]);
            item.setName((String) row[1]);
            item.setCategory((String) row[2]);
            item.setPrice(new BigDecimal((String) row[3]));
            item.setRating(new BigDecimal((String) row[4]));
            item.setDescription((String) row[5]);
            item.setImageUrl((String) row[6]);
            itemsRepository.save(item);
        }
    }
}
