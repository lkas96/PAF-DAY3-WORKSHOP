package vttp.batch5.paf.day23.models;

import java.util.List;

public class PurchaseOrder {
    private String custName;
    private String address;
    private String deliveryDate;
    private List<CartItem> cartItems;

    public String getCustName() {
        return custName;
    }

    public void setCustName(String custName) {
        this.custName = custName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public PurchaseOrder(String custName, String address, String deliveryDate, List<CartItem> cartItems) {
        this.custName = custName;
        this.address = address;
        this.deliveryDate = deliveryDate;
        this.cartItems = cartItems;
    }

    public PurchaseOrder() {

    }

    @Override
    public String toString() {
        return "PurchaseOrder [custName=" + custName + ", address=" + address + ", deliveryDate=" + deliveryDate
                + ", cartItems=" + cartItems + "]";
    }

}
