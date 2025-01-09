package vttp.batch5.paf.day23.models;

public class CartItem {
    private String itemName;
    private int itemCount;
    private String itemPrice;

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }

    public String getItemPrice() {
        return itemPrice;
    }

    public void setItemPrice(String itemPrice) {
        this.itemPrice = itemPrice;
    }

    public CartItem(String itemName, int itemCount, String itemPrice) {
        this.itemName = itemName;
        this.itemCount = itemCount;
        this.itemPrice = itemPrice;
    }

    public CartItem() {

    }

    @Override
    public String toString() {
        return "CartItem [itemName=" + itemName + ", itemCount=" + itemCount + ", itemPrice=" + itemPrice + "]";
    }
}
