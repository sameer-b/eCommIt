/**
 * Created by Sameer on 1/6/2015.
 */



$( document ).ready( function(data) {
    //Show a badge with number of items in cart on the Cart button in the nav bar.
    addCartBadge();
    //Add event listener to the Add to cart button
    $('.addToCart').click(function() {
        addToCart();
    });
    //Listener to display the cart when clicked.
    $('.viewCart').click(function() {
        updateCartBadge();
        displayCart();
    });
    //Listener for the close button on the cart,
    $('.cartCloseButton').click(function(){
        closeCart();
    });
});
/**
 * Updates the product count badge on the cart icon.
 */
var updateCartBadge = function() {
  var cartSize = getCartSize();
  $('.viewCart span').html("<span class='badge'>"+cartSize+"</span>");
};


var addCartBadge = function() {
    var cartSize = getCartSize();
    $('.viewCart').append("<span class='badge'>"+cartSize+"</span>");
};
/**
 * Returns the amount of products in the cart.
 * It calculates it as size = quantity * every product.
 * @returns {number}
 */
var getCartSize = function() {
    var cartSize = 0;
    if(cartExists()) {
        var cart = JSON.parse(localStorage['ecommitCart']);
        for( var i = 0 ; i < cart.length ; ++i ) {
            cartSize = cartSize + parseInt(cart[i].quantity);
        }
        return cartSize;
    }
    else{
        return cartSize;
    }

};
/**
 * Hides the cart when closed by the user.
 */
var closeCart = function() {
  $('.shoppingCart').css('display','none');
};

/**
 * Shows the cart when the user clicks on the Cart button in the nav bar.
 */
var displayCart = function() {
  //Lets clean the cart first.
  $('.shoppingCart table tbody').empty();
  //Get the cart from LocalStorage.
  var cart;
  if(cartExists()) {
      cart  = JSON.parse(localStorage['ecommitCart']);

      if(getCartSize()<1){
          $('.shoppingCart tbody').append("<p class='alert alert-info'> Your cart is empty! :( </p> ");
      }
      else {
          $('.cartTable').find('tbody').append("<tr><th>Product ID</th><th>Item</th> <th>Quantity</th> <th>Price</th> </tr>");
          for( var i = 0 ; i < cart.length ; i++) {
              $('.cartTable').find('tbody').append("<tr> " +
                  "<td class='productId'>" + cart[i].productId + "</td>" +
                "<td>"+ cart[i].productName+"</td>" +
                    "<td> <span class=\"glyphicon decreaseQuantity glyphicon-minus-sign\" aria-hidden=\"true\"></span> <div class = 'quantity'> "+ cart[i].quantity+" </div>  <span class=\"glyphicon increaseQuantity glyphicon-plus-sign\" aria-hidden=\"true\"></span>  </td>" +
                        "<td>"+ cart[i].productPrice+"</td>" +
                            "</tr>");
          }
          addCheckoutButton();
          updateTotal();
      }
  }
  else {
        $('.shoppingCart tbody').append("<p class='alert alert-info'> Your cart is empty! :( </p> ");
  }
  //Show the cart on the screen.
  $('.shoppingCart').css('display','block');

  /**
    * Add listener to the increment quantity button.
    */
  $('.increaseQuantity').click(function() {
        //Increment product in LocalStorage.
        incrementQuantity(getProductIdFromCart($(this)));
        //Display changes to the user.
        $(this).prev().html(getProductQuantity(getProductIdFromCart($(this))));
        //Add or remove checkout button.
        addCheckoutButton();

  });


  /**
   * Add listener to the decrement quantity button.
   */
  $('.decreaseQuantity').click(function() {
        //Decrement product in LocalStorage.
        decrementQuantity(getProductIdFromCart($(this)));
        //Display changes to the user.
        $(this).next().html(getProductQuantity(getProductIdFromCart($(this))));
        //add or remove checkout button.
        addCheckoutButton();
  });
};


/**
 * Add checkbox if it doesn't exist! and if cart contains at least one item.
 */
var addCheckoutButton = function() {

    if ((($('.checkoutButton button').length) == 1) && (getCartSize()<1)) {
        $('.checkoutButton button').remove();

    }

    if ((($('.checkoutButton button').length) == 0) && (getCartSize()>0))
        $('.checkoutButton').append(" <button class='btn btn-large btn-primary'> Proceed to Checkout </button> ");

};

/**
 * This function is used to get the productID from the shopping cart table.
 * It searches the parent of the glyicon clicked and looks for its siblings
 * with class of productId.
 * @param editQuantityButton
 * @returns {XMLList|*|jQuery}
 */
var getProductIdFromCart = function(editQuantityButton) {
    return parseInt($(editQuantityButton).parent().siblings('.productId').text())
};

var getProductQuantity = function(productId) {
    if(cartExists()) {
        var cart = JSON.parse(localStorage['ecommitCart']);
        for ( var i = 0 ; i < cart.length ; ++i) {
            if(cart[i].productId == productId  )
                return cart[i].quantity;
        }
        return 0
    }
};
/**
 * Inserts a product to the cart.
 */
var addToCart = function() {
    var productId = (window.location.pathname).replace( /^\D+/g, '');
    var productPrice =  ($('.productPrice').text()).replace( /^\D+/g, '');
    var productName = ($('.productName').text());

    //create a cart if it doesn't exist
    if(!cartExists())
        createCart();
    //if item is already present in cart then simply increment its quantity.
    if(itemAlreadyInCart(productId) == true ) {
        incrementQuantity(productId);
    }
    else {
        // if item is not there. Lets add the item!

        //information about the product
        var item = {
                'productId' : productId,
                'productName' : productName,
                'productPrice': productPrice,
                'quantity' : parseInt(1)
        };

        //get the cart from LocalStorage
        var cart = localStorage['ecommitCart'];
        cart = JSON.parse(cart);
        //add item to cart
        cart.push(item);
        //update the LocalStorage.
        localStorage['ecommitCart'] = JSON.stringify(cart);
        //Notify the user about the addition of the product to the cart.
        flashMessage("Product added to cart!","alert-success");
        updateTotal();

        //update the count shown on the badge.
        updateCartBadge();
    }
};

var incrementQuantity = function(productId) {
    //get the cart.
    var cart = JSON.parse(localStorage['ecommitCart']);
    //look for the product in the cart and increment its quantity.
    for ( var i = 0 ; i < cart.length; i++) {
        if(cart[i].productId == productId) {
            var quantity = parseInt(cart[i].quantity);
            cart[i].quantity = parseInt(++quantity);
            localStorage['ecommitCart'] = JSON.stringify(cart);
            //Show the user that the quantity has been updated.
            flashMessage("Product added to cart!","alert-success");
            updateTotal();
            updateCartBadge();
            return true;
        }

    }
    flashMessage("Product not added to cart!","alert-danger");
    return false;

};


var decrementQuantity = function(productId) {
    //get the cart.
    var cart = JSON.parse(localStorage['ecommitCart']);
    //look for the product in the cart and increment its quantity.
    for ( var i = 0 ; i < cart.length; i++) {
        if(cart[i].productId == productId) {
            var quantity = parseInt(cart[i].quantity);
            if(quantity <= 0)
                return false;
            cart[i].quantity = parseInt(--quantity);
            localStorage['ecommitCart'] = JSON.stringify(cart);
            //Show the user that the quantity has been updated.
            flashMessage("Product removed from cart!","alert-warning");
            updateTotal();
            updateCartBadge();
            return true;
        }

    }
    flashMessage("Product not removed from cart!","alert-danger");
    return false;

};

var cartExists = function() {
    //see if ecommitCart exists in LocalStorage.
    if( typeof localStorage['ecommitCart'] == 'undefined')
        return false;
    else
        return true;
};


var createCart = function() {
    //Create an empty cart.
    var cart = new Array();
    localStorage['ecommitCart'] = JSON.stringify(cart);
};

var itemAlreadyInCart = function(productId) {
    //Get the cart.
    var cart = JSON.parse(localStorage['ecommitCart']);
    //Search the cart for the product if found return true else return false.
    for ( var i = 0 ; i < cart.length; i++) {
        if(cart[i].productId === productId)
            return true;
    }
    return false;
};

var flashMessage = function(message,alertType) {
    $('.navbar').after(" <div class=\"alert "+alertType+ "\"> <a href=\"#\" class=\"close\" data-dismiss=\"alert\">&times;</a>  "+ message + " </div>");
    fadeMessage(5000);
};

/**
 * Add timeout to remove alert messages.
 */
var fadeMessage = function(timeOut) {

    window.setTimeout(function() {
        $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, timeOut);
};
/**
 * Update the value of total in the cart!
 */
var updateTotal = function () {
    $('.sumTotal').html("<h3> Total: $" + calculateCartTotal().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " </h3>");
};
/**
 *This function calculates the sum total of the products in the cart.
 */

var calculateCartTotal = function () {
  var sumTotal = parseInt(0);
    if(cartExists()) {
        var cart = JSON.parse(localStorage['ecommitCart']);
        for ( var i = 0 ; i < cart.length ; ++i ) {
            console.log("Price"+cart[i].productPrice);
            var price = (cart[i].productPrice).replace(',','');
            var quantity = (cart[i].quantity);
            sumTotal = sumTotal + (parseInt(price) * parseInt(quantity));
        }
        return sumTotal;
    }
    return sumTotal;
};