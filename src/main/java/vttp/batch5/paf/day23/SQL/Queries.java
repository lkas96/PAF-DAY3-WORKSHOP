package vttp.batch5.paf.day23.SQL;

public class Queries {
    public static final String SQL_INSERT_CUSTOMER = "INSERT INTO customers(name, address) values (?, ?)"; 
    public static final String SQL_GET_CUSTOMER_ID = "SELECT cust_id FROM customers where name = ? AND address = ?";

    public static final String SQL_INSERT_PURCHASEORDER = "INSERT INTO purchaseOrders(deliveryDate, p_cust_id) values (?,?)";
    public static final String SQL_GET_PURCHASE_ID = "SELECT purchase_id FROM purchaseOrders WHERE p_cust_id = ? AND deliveryDate = ?";

    public static final String SQL_INSERT_ITEM = "INSERT INTO cartItems VALUES (?, ?, ?, ?)";
}
