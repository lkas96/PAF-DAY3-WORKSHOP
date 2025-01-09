package vttp.batch5.paf.day23.controller;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.batch5.paf.day23.models.CartItem;
import vttp.batch5.paf.day23.models.PurchaseOrder;
import vttp.batch5.paf.day23.service.CartService;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping
public class CartController {
    @Autowired
    private CartService cs;

    @PutMapping("/api/purchaseorder")
    public String addPurchaseOrder(@RequestBody String purchaseOrder) {

        // form passed data as JSON
        // now need to make the json to PurchaseOrder Object
        System.out.println(purchaseOrder);
        //prints out
        // {
        //     "name": "Lawson",
        //     "address": "nus iss 123458",
        //     "deliveryDate": "2025-01-16",
        //     "lineItems": [
        //       {
        //         "name": "Apples",
        //         "quantity": 1,
        //         "unitPrice": 0.3
        //       },
        //       {
        //         "name": "Pear",
        //         "quantity": 2,
        //         "unitPrice": 1.1
        //       }
        //     ]
        //   }

        JsonReader jr = Json.createReader(new StringReader(purchaseOrder));
        JsonObject jo = jr.readObject();

        //now can read the object already now to make the order items yaaaas
        //instantiate the purchaseorder object

        PurchaseOrder po = new PurchaseOrder();
        po.setCustName(jo.getString("name"));
        po.setAddress(jo.getString("address"));
        po.setDeliveryDate(jo.getString("deliveryDate"));

        //now process the json array have to use for loop because can contain multiple items
        //to store the items temp then later to instantiate the purchaseOrder object
        //so now we first instantiate the individual cart items duh
        List<CartItem> list = new ArrayList<>(); 

        JsonArray ja = jo.getJsonArray("lineItems");
        for (int i = 0; i < ja.size(); i++){
            JsonObject eachCartItem = ja.getJsonObject(i);

            CartItem ci = new CartItem();
            ci.setItemName(eachCartItem.getString("name"));
            ci.setItemCount(eachCartItem.getInt("quantity"));
            ci.setItemPrice(eachCartItem.getJsonNumber("unitPrice").toString());
            list.add(ci); 
        }

        po.setCartItems(list);

        //now item has bene instantiated
        //now we add to database yaaaas
        //call service -> service call repo -> repo is the one processing to add lah 
        //then whatever maybe do a return http status if needed omg sickening
        //so pass in this purchaseorder object to the method
        cs.addPurchaseOrder(po);



        // is expecting something back
        // the angular app needs a response status i think

        // ERROR:
        // {"headers":{"headers":{},"normalizedNames":{},"lazyUpdate":null},"status":0,"statusText":"Unknown
        // Error","url":"/api/purchaseorder","ok":false,"name":"HttpErrorResponse","message":"Http
        // failure response for /api/purchaseorder: 0 Unknown
        // Error","error":{"isTrusted":true}}

        return null;
    }

}
