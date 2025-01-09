USE workshop3;

CREATE TABLE customers (
    cust_id INT AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    address VARCHAR(128) NOT NULL,
    CONSTRAINT PK_cust_id PRIMARY KEY (cust_id)
);

CREATE TABLE purchaseOrders (
    purchase_id INT AUTO_INCREMENT,
    deliveryDate CHAR(10) NOT NULL,
    p_cust_id INT,
    CONSTRAINT PK_purchase_id PRIMARY KEY (purchase_id),
    CONSTRAINT FK_cust_id FOREIGN KEY (p_cust_id) REFERENCES customers(cust_id)
);

CREATE TABLE cartItems (
    c_purchase_id INT NOT NULL,
    c_name VARCHAR(64) NOT NULL,
    c_count INT NOT NULL,
    c_price DECIMAL(8, 2) NOT NULL,
    CONSTRAINT PK_id_name PRIMARY KEY (c_purchase_id, c_name),
    CONSTRAINT FK_c_purchase_id FOREIGN KEY (c_purchase_id) REFERENCES purchaseOrders(purchase_id)
);
