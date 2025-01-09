package vttp.batch5.paf.day23.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.batch5.paf.day23.models.PurchaseOrder;

@Service
public class CartService {

    @Autowired
    private CartRepo cr;

    public void addPurchaseOrder(PurchaseOrder po) {
        cr.addPurchaseOrder(po);
    }

}
