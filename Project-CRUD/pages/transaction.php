<?php
$selectCategory = mysqli_query($koneksi, "SELECT * FROM categories ORDER BY id ASC");
$categories = mysqli_fetch_all($selectCategory, MYSQLI_ASSOC);

$selectProduct = mysqli_query($koneksi, "SELECT products.*, categories.name AS category_name FROM products LEFT JOIN categories ON products.category_id = categories.id WHERE products.is_active = 1 ORDER BY id DESC");
$products = mysqli_fetch_all($selectProduct, MYSQLI_ASSOC);
?>
<div class="row">

    <div class="col-lg-8 p-4">

        <ul class="nav nav-tabs" role="tablist">
            <?php
            foreach ($categories as $key => $cat) {
            ?>
                <li class="nav-item">
                    <button class="nav-link <?= $key === 0 ? 'active' : '' ?>"
                        data-bs-toggle="tab"
                        data-bs-target="#tab-pane-<?= $cat['id'] ?>">
                        <?= $cat['name'] ?>
                    </button>
                </li>
            <?php
            }
            ?>
        </ul>

        <div class="tab-content mt-3">

            <?php
            foreach ($categories as $key => $cat) {
            ?>
                <div class="tab-pane fade <?= $key === 0 ? 'show active' : '' ?>" id="tab-pane-<?= $cat['id'] ?>">

                    <div class="d-flex justify-content-between align-items-center mb-3">

                        <div class="fw-semibold">
                            <?php
                            $count = 0;
                            foreach ($products as $p) {
                                if ($p['category_id'] == $cat['id']) {
                                    $count++;
                                }
                                if ($key == 0) {
                                    $count++;
                                }
                            }
                            ?>
                            <span class="fs-5"><?= $count ?></span> Products
                        </div>

                        <div class="flex-grow-1 mx-3">
                            <input type="text" class="form-control" placeholder="Search">
                        </div>

                    </div>

                    <div class="row g-3">

                        <?php
                        foreach ($products as $product) {
                            if ($product['category_id'] == $cat['id'] || $key == 0) {
                        ?>
                                <div class="col-md-4">

                                    <div class="card product-card h-100 shadow-sm">

                                        <div class="p-3 text-center">

                                            <h6 class="mb-1"><?= $product['name'] ?></h6>

                                            <small class="text-muted">
                                                <?= $product['category_name'] ?>
                                            </small>

                                            <div class="mt-2">
                                                <img src="<?= $product['image'] ?>"
                                                    class="img-fluid" style="max-height:150px; object-fit:cover;">
                                            </div>

                                        </div>

                                        <div class="px-3 pb-3 text-center">

                                            <h6 class="fw-bold">
                                                Rp <?= number_format($product['price']) ?>
                                            </h6>

                                            <p class="text-muted">
                                                Ready Stock <?= $product['qty'] ?> <?= $product['unit'] ?>
                                            </p>
                                        </div>
                                        <div class="px-3 pb-3 d-flex justify-content-center gap-2">


                                            <button type="button" class="btn btn-primary btn-sm btn-add-card"
                                                data-id="<?= $product['id'] ?>"
                                                data-name="<?= $product['name'] ?>"
                                                data-price="<?= $product['price'] ?>"
                                                data-image="<?= $product['image'] ?>">
                                                Add To Cart
                                            </button>
                                        </div>

                                    </div>

                                </div>
                        <?php

                            }
                        }
                        ?>

                    </div>

                </div>
            <?php
            }
            ?>
        </div>

    </div>


    <div class="col-lg-4 p-4">

        <ul class="nav nav-tabs">
            <li class="nav-item">
                <button class="nav-link active">Order Details</button>
            </li>
        </ul>

        <div class="card p-3 mt-3 shadow-sm">


            <div id="order-items" style="max-height: 350px; overflow-y: auto;">

            </div>

            <div class="border-top pt-3 mt-3">

                <div class="d-flex justify-content-between">
                    <small>Subtotal</small>
                    <small id="subtotal">Rp 0</small>
                </div>

                <div class="d-flex justify-content-between">
                    <small>Tax</small>
                    <small id="tax">Rp 0</small>
                </div>

                <div class="d-flex justify-content-between">
                    <small>Discount</small>
                    <small id="discount">Rp 0</small>
                </div>

                <div class="d-flex justify-content-between fw-bold fs-5 mt-2">
                    <small>Total</small>
                    <small id="total-bill">Rp 0</small>
                </div>

            </div>

            <div class="mt-3 d-flex gap-2">
                <button class="btn btn-success w-100" id="btn-payment" type="button" data-bs-toggle="modal" data-bs-target="#paymentModal">
                    Payment
                </button>
            </div>

        </div>

    </div>

</div>

<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">

            <div class="modal-header bg-primary text-white rounded-top-4">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Detail Book</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body p-4">
                <div class="row">

                    <div class="col-md-5 text-center mb-3 mb-md-0">
                        <img id="modalImage" src="assets/img/default.jpg" alt="Book Image" class="img-fluid rounded-4 shadow-sm" style="max-height: 300px; object-fit: cover;">
                    </div>

                    <div class="col-md-7">
                        <h3 id="modalTitle" class="fw-bold text-dark mb-3">Judul Buku</h3>

                        <div class="mb-2">
                            <strong>Category:</strong> <span id="modalCategory"></span>
                        </div>
                        <div class="mb-2">
                            <strong>Author:</strong> <span id="modalAuthor"></span>
                        </div>
                        <div class="mb-2">
                            <strong>Publisher:</strong> <span id="modalPublisher"></span>
                        </div>
                        <div class="mb-2">
                            <strong>Year:</strong> <span id="modalYear"></span>
                        </div>
                        <div class="mb-2">
                            <strong>Price:</strong> <span id="modalPrice" class="text-success fw-bold"></span>
                        </div>
                        <div class="mb-2">
                            <strong>Stock:</strong> <span id="modalStock"></span> pcs
                        </div>

                        <hr>

                        <div>
                            <strong>Description:</strong>
                            <p id="modalDescription" class="text-muted mt-2 mb-0"></p>
                        </div>
                    </div>

                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary rounded-3" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary rounded-3" id="modalAddToCartBtn">
                    Add To Cart
                </button>
            </div>

        </div>
    </div>
</div>

<div class="modal fade" id="paymentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content rounded-4 shadow-lg border-0">

            <div class="modal-header bg-success text-white rounded-top-4">
                <h1 class="modal-title fs-5" id="paymentModalLabel">Payment Method</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form action="" method="POST">
                <input type="text" name="cart-data" id="cart-data" class="form-control">
                <div class="modal-body p-4">

                    <h5 class="mb-3">Pilih Metode Pembayaran</h5>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="w-100">
                                <input type="radio" name="payment_method" value="COD" class="d-none payment-option" checked>
                                <div class="card p-4 shadow-sm border payment-card h-100">
                                    <h4 class="text-success">COD</h4>
                                    <p class="text-muted mb-0">Bayar di tempat saat buku diterima.</p>
                                </div>
                            </label>
                        </div>

                        <div class="col-md-6">
                            <label class="w-100">
                                <input type="radio" name="payment_method" value="MIDTRANS" class="d-none payment-option">
                                <div class="card p-4 shadow-sm border payment-card h-100">
                                    <h4 class="text-primary">Midtrans</h4>
                                    <p class="text-muted mb-0">Pembayaran online via payment gateway.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <hr class="my-4">

                    <div class="row">
                        <div class="col-md-6">
                            <div class="border rounded-3 p-3 bg-light">
                                <h6 class="fw-bold mb-3">Ringkasan Pembayaran</h6>

                                <div class="d-flex justify-content-between mb-2">
                                    <span>Subtotal</span>
                                    <span>Rp 0</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <span>Tax</span>
                                    <span>Rp 0</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <span>Discount</span>
                                    <span>- Rp 0</span>
                                </div>

                                <hr>

                                <div class="d-flex justify-content-between fw-bold fs-5">
                                    <span>Total</span>
                                    <span>Rp 0</span>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="alert alert-info rounded-3 mb-0">
                                <strong>Catatan:</strong><br>
                                - Jika memilih <b>COD</b>, pesanan akan langsung diproses.<br>
                                - Jika memilih <b>Midtrans</b>, nanti bisa diarahkan ke payment gateway.
                            </div>
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary rounded-3" data-bs-dismiss="modal">Close</button>
                    <button type="submit" name="process_payment" class="btn btn-success rounded-3 px-4">
                        Bayar Sekarang
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>

<script>
    //looping product card
    //tanpa event delegation
    // document.querySelectorAll('.product-card').forEach((button) => {
    //     button.addEventListener('click', function(){
    //         this.getAttribute('data-id');
    //     })
    // });

    //event delegation
    let cart = [];
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btn-add-card')) {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            const image = e.target.getAttribute('data-image');

            //jika cart nya sama valuenya dengan yang dikiri dari button atau sudah ada
            //foreach(cart as item)
            const extProducts = cart.find(item => item.id === id);
            if (extProducts) {
                extProducts.qty += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    qty: 1
                })
            }
            renderCart();
        }
    })

    function renderCart() {
        const containerCart = document.getElementById('order-items');
        containerCart.innerHTML = "";

        if (cart.length === 0) {
            containerCart.innerHTML = "<p class='text-muted text-center py-3'>Cart Empty</p>"
            updateCart();
            return;
        }

        //cart.forEach(function(item, index){})
        cart.forEach(value => {
            const itemHtml = `
            <div class="card p-2 mb-2 border-0 shadow-sm">

                    <div class="d-flex justify-content-between align-items-center">

                        <div class="d-flex align-items-center gap-3">
                            <img class="rounded-circle" src="${value.image}" width="45" height="45" style="object-fit: cover;">

                            <div>
                                <div class="fw-semibold">${value.name}</div>
                                <small class="text-muted">
                                    Rp ${value.price}
                                </small>
                            </div>
                        </div>

                        <a href="#" class="btn btn-sm btn-outline-danger btn-delete" data-id=${value.id}>
                            X
                        </a>

                    </div>

                    <div class="d-flex justify-content-between align-items-center my-3">

                        <div class="d-flex align-items-center gap-1">
                            <a href="#" class="btn btn-outline-primary btn-sm btn-minus" data-id=${value.id}>-</a>

                            <span class="fw-semibold px-2">${value.qty}</span>

                            <a href="#" class="btn btn-outline-primary btn-sm btn-plus" data-id=${value.id}>+</a>
                        </div>

                        <div class="fw-bold">
                            Rp ${(value.price * value.qty).toLocaleString('id-ID')}
                        </div>

                    </div>

                </div>
            `
            containerCart.insertAdjacentHTML("beforeend", itemHtml)
        })
        updateCart();
    }

    document.getElementById('order-items').addEventListener('click', function(e) {
        const id = e.target.getAttribute('data-id');
        if (!id) return;

        const itemIndex = cart.findIndex(item => item.id === id);
        if (e.target.classList.contains('btn-plus')) {
            cart[itemIndex].qty += 1;
        } else if (e.target.classList.contains('btn-minus')) {
            //jika di cart qty cuma 1
            if (cart[itemIndex].qty > 1) {
                cart[itemIndex].qty -= 1;
            } else {
                //qty cuma 1 terus mau di minus lagi jadi maka hilang product di cart nya
                //splice(index, 1)
                cart.splice(itemIndex, 1)
            }
        } else if (e.target.classList.contains('btn-delete')) {
            cart.splice(itemIndex, 1)
        }
        renderCart();
    })

    function updateCart() {
        let subtotal = 0;
        let tax = 0;
        let discount = 0;

        cart.forEach(item => {
            subtotal += item.price * item.qty;
        })
        tax = subtotal * 0.1;
        let total = subtotal + tax - discount;

        const formatRupiah = (number) => {
            return "Rp." + number.toLocaleString('id-ID');
        }

        document.getElementById('subtotal').innerText = formatRupiah(subtotal);
        document.getElementById('tax').innerText = formatRupiah(tax);
        document.getElementById('discount').innerText = formatRupiah(discount);
        document.getElementById('total-bill').innerText = formatRupiah(total);

        const cartModal = document.querySelector('#paymentModal .border.rounded-3');
        //jika cart modal terbuka
        if (cartModal) {
            const spans = cartModal.querySelectorAll('span');
            if (spans.length >= 8) {
                spans[1].innerText = formatRupiah(subtotal);
                spans[3].innerText = formatRupiah(tax);
                spans[5].innerText = "-" + formatRupiah(discount);
                spans[7].innerText = formatRupiah(total);
            }
        }
        document.getElementById('cart-data').value = JSON.stringify(cart);
    }

    document.getElementById('btn-payment').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Cart is empty');

            //stopPropagation(); : modal tidak muncul
            e.stopPropagation();
        }
    })
</script>