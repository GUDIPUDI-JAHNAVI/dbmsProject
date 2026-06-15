package dbms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import dbms.models.Roles;

public interface RolesRepository extends JpaRepository<Roles, Long> {

    Optional<Roles> findByName(String name);
}
