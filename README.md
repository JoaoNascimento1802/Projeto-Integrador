# Projeto-Integrador

Este é um projeto de uma API de CRUD para um zoológico, desenvolvida em Spring Boot. A aplicação permite adicionar, visualizar, atualizar e remover registros de animais em um zoológico.

## Demonstração

![Demonstração do Projeto](https://www.saopaulo.sp.gov.br/wp-content/uploads/2016/12/zoo-safari.jpg)

## Funcionalidades

- **Adicionar um novo animal**: Registre novos animais com informações detalhadas.
- **Visualizar animais**: Liste todos os animais do zoológico.
- **Atualizar informações**: Altere os dados dos animais cadastrados.
- **Remover animais**: Exclua o registro de um animal.

## Tecnologias Utilizadas

- **Java 17**
- **Spring Boot **
- **MySQL** para o banco de dados
- **Spring Data JPA** para integração com o banco
- **Lombok** para simplificação de código
- **Postman** (opcional) para testar a API

## Estrutura do Projeto

```plaintext
.
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.example.zoologico/
│   │   │       ├── controller/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       └── service/
│   │   └── resources/
│   │       ├── application.properties
│   └── test/
├── pom.xml
└── README.md
