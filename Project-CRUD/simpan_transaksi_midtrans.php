<?php 
include 'config/koneksi.php';

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

if (!empty($input)) {
    $order_no = $input['order_no'];
    $customer_name = $input['customer_name'];
    $payment_method = $input['payment_method'];
    $subtotal = $input['subtotal'];
    $tax = $input['tax'];
    $discount = $input['discount'];
    $total_bill = $input['total_bill'];
    $payment_status = 'SUCCESS';

    $cart_row = base64_decode($input['cart-data']);
    $cart_items = json_decode($cart_row,true);

    $orderDetailInput = mysqli_query($koneksi, "INSERT INTO orders(order_no, customer_name, payment_method, subtotal, tax, discount, total_bill, payment_status) 
    VALUES ('$order_no','$customer_name','$payment_method','$subtotal','$tax','$discount','$total_bill','$payment_status')");

    if ($orderDetailInput) {
        $order_id = mysqli_insert_id($koneksi);
        foreach($cart_items as $item){
            $product_id = $item['id'];
            $product_name = $item['name'];
            $price = $item['price'];
            $quantity = $item['qty'];
            $total_price = $price * $quantity;

            $OrderDetail = mysqli_query($koneksi, "INSERT INTO order_details(order_id, product_id, product_name, price, quantity, total_price) 
            VALUES ('$order_id','$product_id','$product_name','$price','$quantity','$total_price')");

            if($OrderDetail){
                mysqli_query($koneksi, "UPDATE products SET qty=qty-$quantity WHERE id='$product_id'");
            }
        }

        echo json_encode(['success' => true, 'order_id' => $order_id]);
    }else{
        echo json_encode(['success' => false, 'error' => mysqli_error($koneksi)]);
    }
}else{
    echo json_encode(['success' => false, 'error' => 'Data Kosong']);
}
?>