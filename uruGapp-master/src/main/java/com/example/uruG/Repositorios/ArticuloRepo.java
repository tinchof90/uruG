package com.example.uruG.Repositorios;


import org.springframework.data.repository.CrudRepository;

import com.example.uruG.Articulo;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface ArticuloRepo extends CrudRepository<Articulo, Integer> {

}