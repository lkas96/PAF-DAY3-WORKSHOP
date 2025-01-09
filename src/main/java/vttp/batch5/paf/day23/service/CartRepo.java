package vttp.batch5.paf.day23.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import vttp.batch5.paf.day23.SQL.Queries;
import vttp.batch5.paf.day23.models.CartItem;
import vttp.batch5.paf.day23.models.PurchaseOrder;

@Repository
public class CartRepo {

    @Autowired
    private JdbcTemplate template;

    public void addPurchaseOrder(PurchaseOrder po) {
        // do the prepared mysql isnert statement first
        // PLAN THE TABLES FIRST
        // DO THE PRIJMARY KEYS WHATEVER
        // then do the query and get rows affected number?? or something then bam addded
        // success
        // ignore the return message for now first, make sure can add to the database
        // first

        // FIRST ADD TO CUSTOMER DATABASE
        int rowAdded1 = template.update(Queries.SQL_INSERT_CUSTOMER, po.getCustName(), po.getAddress());

        if (rowAdded1 == 1) {
            // means successfully added

            // do the next step
            // add to purchase
            SqlRowSet oneCustomer = template.queryForRowSet(Queries.SQL_GET_CUSTOMER_ID, po.getCustName(),
                    po.getAddress());

            if (oneCustomer.next()) {
                // means found, should have one record.
                // get the customer id

                String customerId = oneCustomer.getString("cust_id");

                // now add the purchaseorder tables
                int rowAdded2 = template.update(Queries.SQL_INSERT_PURCHASEORDER, po.getDeliveryDate(), customerId);

                if (rowAdded2 == 1) {
                    // means successfully added
                    // proceed with the cart items
                    // since it is a list containing multiple items we need to loop it throughhhhh

                    // get the purchase id
                    SqlRowSet onePurchase = template.queryForRowSet(Queries.SQL_GET_PURCHASE_ID, customerId,
                            po.getDeliveryDate());

                    if (onePurchase.next()) {
                        // eemans record found, should have one.
                        // extract the value

                        String purchase_id = onePurchase.getString("purchase_id");

                        // now add to the cart items
                        for (int i = 0; i < po.getCartItems().size(); i++) {
                            CartItem oneItem = po.getCartItems().get(i);

                            // now add to the db
                            int rowAdded3 = template.update(Queries.SQL_INSERT_ITEM, purchase_id, oneItem.getItemName(),
                                    oneItem.getItemCount(), oneItem.getItemPrice());

                            if (rowAdded3 == 1){
                                System.out.println("PURCHASE ORDER COMPLETED AND ADDED TO DATABSE");
                            }
                        }
                    }
                }
            }
        }
        
        //COMPLETE ALL ADDING TO CART SHIT ALREADY YAASA DONE OKAY.
    }

}
