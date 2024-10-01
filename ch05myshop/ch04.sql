-- 1. 'comstudy' 계정 생성 (모든 호스트에서 접근 가능)
CREATE USER 'comstudy'@'%' IDENTIFIED BY '1234';

-- 2. ch04 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON ch04.* TO 'comstudy'@'%';

-- 3. 권한 적용
FLUSH PRIVILEGES;


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