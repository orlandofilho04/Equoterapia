package com.equoterapia.web.entities;

import com.equoterapia.web.entities.enums.Genders;
import com.equoterapia.web.entities.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_professionals")
public class Professional implements UserDetails {

    public Professional(String name, String username, LocalDate birthDate, String encryptedPassword, String cpf, String email, String phone, String address, Genders gender,  Roles role, String regNumber) {
        this.name = name;
        this.username = username;
        this.birthDate = birthDate;
        this.password = encryptedPassword;
        this.cpf = cpf;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.role = role;
        this.gender = gender;
        this.regNumber = regNumber;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(unique = true)
    private String username;

    @Column
    private LocalDate birthDate;

    @Column
    private String password;

    @Column(unique = true, length = 12)
    private String cpf;

    @Column
    private String email;

    @Column
    private String phone;

    @Column
    private String address;

    @Column
    private Roles role;

    @Column
    private Genders gender;

    @Column(unique = true)
    private String regNumber;

    @Column
    private Boolean isAdmin = false;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ADMIN"));
    }
    @JsonIgnore
    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    @ManyToMany
    @JsonIgnore
    @JoinTable(name = "tb_professionals_has_pacients",
            joinColumns = @JoinColumn(name = "professional_id"),
            inverseJoinColumns = @JoinColumn(name = "pacient_id"))
    private List<Pacient> pacients = new ArrayList<>();

    @OneToMany(mappedBy = "professional")
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();
}
