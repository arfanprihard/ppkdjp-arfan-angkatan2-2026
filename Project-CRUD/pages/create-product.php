<?php
$id = isset($_GET['id']) ? mysqli_real_escape_string($koneksi, $_GET['id']) : '';
$isEdit = !empty($id);

$nameVal = '';
$categoryIdVal = '';
$imageVal = '';
$qtyVal = '';
$priceVal = '';
$unitVal = '';
$descriptionVal = '';
$isActiveVal = '';
$error = '';

if ($isEdit) {
    $query = mysqli_query($koneksi, "SELECT * FROM products WHERE id = '$id'");
    $product = mysqli_fetch_assoc($query);
    if ($product) {
        $nameVal = $product['name'];
        $categoryIdVal = $product['category_id'];
        $imageVal = $product['image'];
        $qtyVal = $product['qty'];
        $priceVal = $product['price'];
        $unitVal = $product['unit'];
        $descriptionVal = $product['description'];
        $isActiveVal = $product['is_active'];
    } else {
        $error = "Product tidak ditemukan.";
    }
}

if (isset($_POST['simpan_data'])) {
    $nameVal = mysqli_real_escape_string($koneksi, $_POST['name']);
    $categoryIdVal = mysqli_real_escape_string($koneksi, $_POST['category_id']);
    $qtyVal = mysqli_real_escape_string($koneksi, $_POST['qty']);
    $priceVal = mysqli_real_escape_string($koneksi, $_POST['price']);
    $unitVal = mysqli_real_escape_string($koneksi, $_POST['unit']);
    $descriptionVal = mysqli_real_escape_string($koneksi, $_POST['description']);
    $isActiveVal = isset($_POST['is_active']) ? mysqli_real_escape_string($koneksi, $_POST['is_active']) : '';

    $uploadedImage = $imageVal;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'assets/uploads/products/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $fileName;

        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (in_array($_FILES['image']['type'], $allowedTypes)) {
            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
                // Delete old image if editing
                if ($isEdit && !empty($imageVal) && file_exists($imageVal)) {
                    unlink($imageVal);
                }
                $uploadedImage = $targetFile;
            } else {
                $error = "Gagal mengupload gambar!";
            }
        } else {
            $error = "Format gambar tidak didukung! Gunakan JPG, PNG, GIF, atau WEBP.";
        }
    }

    if (empty($error)) {
        if (empty($nameVal) || empty($categoryIdVal) || $isActiveVal === '' || empty($qtyVal)) {
            $error = "Nama, Category, Quantity, Price, Unit, dan Status harus diisi!";
        } else {
            $uploadedImage = mysqli_real_escape_string($koneksi, $uploadedImage);

            if ($isEdit) {
                try {
                    $update = mysqli_query($koneksi, "UPDATE products SET name='$nameVal', category_id='$categoryIdVal', image='$uploadedImage', qty='$qtyVal', price='$priceVal', unit='$unitVal', description='$descriptionVal', is_active='$isActiveVal' WHERE id='$id'");

                    if ($update) {
                        $_SESSION['alert_success'] = "Product berhasil diperbarui!";
                        header("Location: ?page=product");
                        exit();
                    } else {
                        $error = "Gagal mengupdate product: " . mysqli_error($koneksi);
                    }
                } catch (mysqli_sql_exception $e) {
                    switch ($e->getCode()) {
                        case 1062:
                            $error = "Data sudah ada!";
                            break;
                        case 1452:
                            $error = "Data relasi tidak ditemukan!";
                            break;
                        default:
                            $error = "Terjadi kesalahan sistem";
                    }
                }
            } else {
                try {
                    $insert = mysqli_query($koneksi, "INSERT INTO products (name, category_id, image, qty, price, unit, description, is_active) VALUES ('$nameVal', '$categoryIdVal', '$uploadedImage', '$qtyVal', '$priceVal', '$unitVal', '$descriptionVal', '$isActiveVal')");
                    if ($insert) {
                        $_SESSION['alert_success'] = "Product berhasil ditambahkan!";
                        header("Location: ?page=product");
                        exit();
                    } else {
                        $error = "Gagal menambahkan product: " . mysqli_error($koneksi);
                    }
                } catch (mysqli_sql_exception $e) {
                    switch ($e->getCode()) {
                        case 1062:
                            $error = "Data sudah ada!";
                            break;
                        case 1452:
                            $error = "Data relasi tidak ditemukan!";
                            break;
                        default:
                            $error = "Terjadi kesalahan sistem";
                    }
                }
            }
        }
    }
}
?>

<div class="card">
    <div class="card-header">
        <h5 class="card-title"><?= $isEdit ? 'Edit Product' : 'Create Product' ?></h5>
    </div>
    <div class="card-body">
        <?php if (!empty($error)): ?>
            <div class="alert alert-danger alert-dismissible" role="alert">
                <?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <form action="" method="POST" enctype="multipart/form-data">

            <div class="row">
                <div class="mb-3 col-6">
                    <label for="name" class="form-label">Nama Product *</label>
                    <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($nameVal) ?>">
                </div>
                <div class="mb-3 col-6">
                    <label for="category_id" class="form-label">Category *</label>
                    <select name="category_id" class="form-control">
                        <option value="">-- Pilih Category --</option>
                        <?php
                        $categories = mysqli_query($koneksi, "SELECT * FROM categories ORDER BY name ASC");
                        while ($category = mysqli_fetch_assoc($categories)) {
                        ?>
                            <option value="<?= $category['id'] ?>" <?= $categoryIdVal == $category['id'] ? 'selected' : '' ?>>
                                <?= htmlspecialchars($category['name']) ?>
                            </option>
                        <?php } ?>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="mb-3 col-6">
                    <label for="qty" class="form-label">Quantity *</label>
                    <input type="number" name="qty" class="form-control" value="<?= htmlspecialchars($qtyVal) ?>">
                </div>
                <div class="mb-3 col-6">
                    <label for="price" class="form-label">Price *</label>
                    <input type="number" name="price" class="form-control" step="0.01" value="<?= htmlspecialchars($priceVal) ?>">
                </div>
            </div>
            <div class="row">
                <div class="mb-3 col-6">
                    <label for="unit" class="form-label">Unit *</label>
                    <input type="text" name="unit" class="form-control" value="<?= htmlspecialchars($unitVal) ?>">
                </div>
                <div class="mb-3 col-6">
                    <label for="image" class="form-label">Image</label>
                    <input type="file" name="image" class="form-control" accept="image/*">
                    <?php if ($isEdit && !empty($imageVal)): ?>
                        <small class="text-muted">Current: <?= htmlspecialchars($imageVal) ?></small>
                    <?php endif; ?>
                </div>
            </div>
            <div class="row">
                <div class="mb-3 col-6">
                    <label for="description" class="form-label">Description</label>
                    <textarea id="mytextarea" name="description"></textarea>
                </div>
                <div class="mb-3 col-6">
                    <label for="" class="form-label">Is Active *</label> <br>
                    <div class="h-100">
                        <input type="radio" name="is_active" value="1" <?= $isActiveVal === "1" ? 'checked' : '' ?>> Active
                        <input type="radio" name="is_active" value="0" <?= $isActiveVal === "0" ? 'checked' : '' ?>> Inactive
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <button type="submit" name="simpan_data" class="btn btn-primary me-2">Submit</button>
                <a href="?page=product" class="btn btn-outline-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>