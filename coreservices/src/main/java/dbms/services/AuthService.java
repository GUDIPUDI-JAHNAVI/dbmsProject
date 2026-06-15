package dbms.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import dbms.models.Roles;
import dbms.models.Users;
import dbms.repository.RolesRepository;
import dbms.repository.UsersRepository;
import dbms.util.ApiResponse;

@Service
public class AuthService {

    private static final String DEFAULT_ROLE = "USER";

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private RolesRepository roleRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public ApiResponse<Map<String, Object>> register(Map<String, Object> data) {
        try {
            String email = data.get("email").toString().trim().toLowerCase();
            String plainPassword = data.get("password").toString();

            if (userRepository.existsByEmailIgnoreCase(email)) {
                throw new Exception("User already exists");
            }

            Roles role = roleRepository.findByName(DEFAULT_ROLE)
                    .orElseThrow(() -> new Exception("Default role not configured"));

            Users user = new Users();
            user.setEmail(email);
            user.setPassword(plainPassword);
            user.setFirstName(data.get("firstName").toString().trim());
            user.setLastName(data.get("lastName").toString().trim());
            user.setRole(role);

            Users saved = userRepository.save(user);
            jdbcTemplate.update("UPDATE users SET password = ? WHERE id = ?", plainPassword, saved.getId());

            return ApiResponse.success("Account created", buildAuthData(saved));
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    public ApiResponse<Map<String, Object>> login(Map<String, Object> data) {
        try {
            String email = data.get("email").toString().trim().toLowerCase();
            String password = data.get("password").toString();

            Users user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new Exception("Invalid credentials"));

            if (!password.equals(user.getPassword())) {
                throw new Exception("Invalid credentials");
            }

            return ApiResponse.success(buildAuthData(user));
        } catch (Exception e) {
            return ApiResponse.error(401, e.getMessage());
        }
    }

    private Map<String, Object> buildAuthData(Users user) throws Exception {
        Map<String, Object> authData = new HashMap<>();
        authData.put("token", jwtService.generateToken(user));
        authData.put("user", toUserMap(user));
        return authData;
    }

    private Map<String, Object> toUserMap(Users user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("email", user.getEmail());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("role", user.getRole().getName());
        return userMap;
    }
}
