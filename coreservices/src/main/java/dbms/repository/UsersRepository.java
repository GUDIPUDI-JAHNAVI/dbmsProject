package dbms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import dbms.models.Users;

public interface UsersRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
