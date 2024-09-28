# 4장: 모놀리식 서비스의 요구 사항 정의, 시스템 및 REST API 설계, 데이터베이스 설계

# **1. 요구 사항 정의**

- 애플리케이션에서 필요한 기능과 서비스를 정리하는 단계입니다.
- **예시**: 온라인 쇼핑몰을 만든다고 가정해보면 다음과 같은 기능이 필요합니다.
    - **상품 관리**: 상품을 추가, 수정, 삭제, 조회할 수 있어야 함.
    - **회원 관리**: 회원 가입, 로그인, 정보 수정 등 회원과 관련된 기능 필요.
    - **구매 관리**: 회원이 상품을 구매하고, 주문 상태를 확인할 수 있어야 함.

# **2. 시스템 구성 설계**

- 전체 시스템이 어떻게 작동할지 설계합니다. 이 단계에서는 서비스 간의 연결 관계와 데이터 흐름을 정리합니다.
- **예시**:
    - 쇼핑몰은 회원 관리, 상품 관리, 구매 관리의 3가지 주요 부분으로 구성됩니다.
    - 사용자가 회원으로 가입하고 상품을 검색한 후, 상품을 구매하는 흐름을 설계합니다.

# **3. REST API 설계**

- 각 기능을 구현하기 위해 데이터를 주고받는 방법을 정의합니다. API를 통해 클라이언트(프론트엔드)와 서버가 통신합니다.
    
    ### **상품 관리**
    
    | **Method** | **Endpoint** | **Description** |
    | --- | --- | --- |
    | GET | /products | 모든 상품 조회 |
    | POST | /products | 새 상품 추가 |
    | PUT | /products/:id | 상품 정보 수정 |
    | DELETE | /products/:id | 상품 삭제 |
    
    ### **회원 관리**
    
    | **Method** | **Endpoint** | **Description** |
    | --- | --- | --- |
    | POST | /users/register | 회원 가입 |
    | POST | /users/login | 로그인 |
    
    ### **구매 관리**
    
    | **Method** | **Endpoint** | **Description** |
    | --- | --- | --- |
    | POST | /orders | 주문 생성 |
    | GET | /orders/:id | 특정 주문 조회 |

## 새 프로젝트 생성

- 새 폴더를 생성 하고 npm init 명령으로 package.json 설정 파일 생성
- express 모듈 설치
    
    ```bash
    npm init -y
    npm i -S express
    ```
    

### server.js

- 이 코드는 간단한 상품 관리 API를 구현한 것입니다.
- 이 예제에서는 상품을 조회, 추가, 수정, 삭제할 수 있습니다.
    
    ```jsx
    // Express를 사용한 간단한 REST API
    const express = require('express');
    const app = express();
    app.use(express.json());
    
    let products = [];
    
    // 상품 조회
    app.get('/products', (req, res) => {
      res.json(products);
    });
    
    // 상품 추가
    app.post('/products', (req, res) => {
      const product = req.body;
      products.push(product);
      res.status(201).json(product);
    });
    
    // 상품 수정
    app.put('/products/:id', (req, res) => {
      const id = parseInt(req.params.id);
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        products[productIndex] = req.body;
        res.json(products[productIndex]);
      } else {
        res.status(404).send('Product not found');
      }
    });
    
    // 상품 삭제
    app.delete('/products/:id', (req, res) => {
      const id = parseInt(req.params.id);
      products = products.filter((p) => p.id !== id);
      res.status(204).send();
    });
    
    const PORT = 3000;
    app.listen(PORT , () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    ```
    
- 서버 실행
    
    ```bash
    node server.js
    ```
    

# **4. 데이터베이스 설계**

- 필요한 데이터들을 저장하기 위한 테이블을 설계하는 단계입니다.
- DBMS 종류: MySQL 8.0
    
    ### **상품 테이블 (Products)**
    
    | **Column** | **Type** | **Description** | **Constraints** |
    | --- | --- | --- | --- |
    | `id` | INT | 상품 ID | Primary Key |
    | `name` | VARCHAR | 상품 이름 | NOT NULL |
    | `price` | DECIMAL | 가격 | NOT NULL |
    | `description` | TEXT | 설명 | NULL |
    
    ### **회원 테이블 (Users)**
    
    | **Column** | **Type** | **Description** | **Constraints** |
    | --- | --- | --- | --- |
    | `id` | INT | 회원 ID | Primary Key |
    | `username` | VARCHAR | 사용자 이름 | NOT NULL, UNIQUE |
    | `password` | VARCHAR | 비밀번호 | NOT NULL |
    | `email` | VARCHAR | 이메일 | NOT NULL, UNIQUE |
    
    ### **주문 테이블 (Orders)**
    
    | **Column** | **Type** | **Description** | **Constraints** |
    | --- | --- | --- | --- |
    | `id` | INT | 주문 ID | Primary Key |
    | `user_id` | INT | 회원 ID (누가 주문했는지) | Foreign Key → Users(id) |
    | `product_id` | INT | 상품 ID (어떤 상품을 주문했는지) | Foreign Key → Products(id) |
    | `quantity` | INT | 수량 | NOT NULL |

## **예제 데이터베이스 설계 코드** (SQL):

- MySQL 8.0을 설치하고 MySQL 8.0 Command Line Client를 이용해서 테이블을 생성 합니다.
- database명: ch04

### ch04.sql

```sql
-- 데이터베이스 생성
CREATE DATABASE ch04;
USE ch04;

-- 상품 테이블 생성
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- 회원 테이블 생성
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- 주문 테이블 생성
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);
```

- 이 SQL 코드는 데이터베이스에 필요한 테이블을 정의한 것입니다.
- 다음은 테이블에 데이터를 삽입하고 조회 하는 예제입니다.

```sql
-- 데이터 삽입
-- 상품 테이블에 데이터 삽입
INSERT INTO Products (name, price, description) VALUES
('Laptop', 1200.00, 'High performance laptop with 16GB RAM and 512GB SSD'),
('Smartphone', 800.00, 'Latest model smartphone with a powerful camera'),
('Headphones', 150.00, 'Noise-cancelling wireless headphones');

-- 회원 테이블에 데이터 삽입
INSERT INTO Users (username, password, email) VALUES
('john_doe', 'password123', 'john@example.com'),
('jane_smith', 'securepass', 'jane@example.com');

-- 주문 테이블에 데이터 삽입
INSERT INTO Orders (user_id, product_id, quantity) VALUES
(1, 1, 1),  -- john_doe가 Laptop 1개 주문
(1, 3, 2),  -- john_doe가 Headphones 2개 주문
(2, 2, 1);  -- jane_smith가 Smartphone 1개 주문

-- 기본 데이터 조회
SELECT * FROM Products;
SELECT * FROM Users;
SELECT * FROM Orders;

-- JOIN을 사용하여 데이터 조회 (주문 내역 확인)
SELECT 
    Orders.id AS order_id,
    Users.username AS customer,
    Products.name AS product_name,
    Products.price AS unit_price,
    Orders.quantity,
    (Products.price * Orders.quantity) AS total_price
FROM 
    Orders
JOIN 
    Users ON Orders.user_id = Users.id
JOIN 
    Products ON Orders.product_id = Products.id;
```

- Join문 실행 결과

```sql
+----------+------------+--------------+------------+----------+-------------+
| order_id | customer   | product_name | unit_price | quantity | total_price |
+----------+------------+--------------+------------+----------+-------------+
|        3 | jane_smith | Smartphone   |     800.00 |        1 |      800.00 |
|        1 | john_doe   | Laptop       |    1200.00 |        1 |     1200.00 |
|        2 | john_doe   | Headphones   |     150.00 |        2 |      300.00 |
+----------+------------+--------------+------------+----------+-------------+
3 rows in set (0.00 sec)
```

## 계정 생성 및 권한 부여

- `ch04` 데이터베이스에 접근할 수 있는 계정 을 생성하고 권한을 부여하겠습니다.
- 계정id: `comstudy`, 비밀번호: `1234`

```sql
-- 1. 'comstudy' 계정 생성 (모든 호스트에서 접근 가능)
CREATE USER 'comstudy'@'%' IDENTIFIED BY '1234';

-- 2. ch04 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON ch04.* TO 'comstudy'@'%';

-- 3. 권한 적용
FLUSH PRIVILEGES;
```

### **요약**

- **요구 사항 정의**: 필요한 기능을 정리함 (상품, 회원, 구매 관리 등).
- **시스템 구성 설계**: 전체 흐름과 구조를 설계함.
- **REST API 설계**: 각 기능을 위한 API를 만들고 데이터를 주고받는 방법을 정의함.
- **데이터베이스 설계**: 데이터 저장을 위한 테이블을 설계함.

이 과정을 통해 전체 시스템을 구축하는 기본 틀을 잡을 수 있습니다.