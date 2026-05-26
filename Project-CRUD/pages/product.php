<?php
$selectCategories = mysqli_query($koneksi, "SELECT products.*, categories.name AS category_name FROM products LEFT JOIN categories ON products.category_id = categories.id ORDER BY id DESC");
$rows = mysqli_fetch_all($selectCategories, MYSQLI_ASSOC);
?>
<div class="card">
    <div class="card-header">
        <h5>

            Manage Categories
        </h5>
    </div>
    <div class="card-body">
        <div class="mb-2" align="right">
            <a href="?page=create-product" class="btn btn-primary">Create New Categories</a>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Unit</th>
                        <th>Description</th>

                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $no = 1;
                    foreach ($rows as $row) { ?>
                        <tr>
                            <td><?= $no++ ?></td>
                            <td><img src="<?= htmlspecialchars($row['image']) ?>" width="80"></td>
                            <td><?= $row['name'] ?></td>
                            <td><?= $row['category_name'] ?></td>
                            <td><?= $row['qty'] ?></td>
                            <td>Rp <?= number_format($row['price'], 0, ',', '.') ?></td>
                            <td><?= $row['unit'] ?></td>
                            <td><?= $row['description'] ?></td>
                            <td><?= $row['is_active'] == "1" ? '<div class="text-primary">Active</div>' : '<div class="text-danger">Inactive</div>' ?></td>
                            <td>
                                <a href="?page=create-product&id=<?= $row['id'] ?>" class="btn btn-primary btn-sm">Edit</a>
                                <a href="?page=product&action=delete&id=<?= $row['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin ingin menghapus product ini?')">Delete</a>
                            </td>
                        </tr>
                    <?php }
                    ?>

                </tbody>
            </table>
        </div>
    </div>
</div>