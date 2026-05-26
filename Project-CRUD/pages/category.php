<?php
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $delete_id = mysqli_real_escape_string($koneksi, $_GET['id']);
    if (mysqli_query($koneksi, "DELETE FROM categories WHERE id = '$delete_id'")) {
        $_SESSION['alert_success'] = "Category berhasil dihapus!";
    } else {
        $_SESSION['alert_error'] = "Gagal menghapus category: " . mysqli_error($koneksi);
    }
    header("Location: ?page=category");
    exit();
}

$selectCategories = mysqli_query($koneksi, "SELECT * FROM categories ORDER BY id DESC");
$rows = mysqli_fetch_all($selectCategories, MYSQLI_ASSOC);
?>
<div class="card">
    <div class="card-header">
        <h5>

            Manage Categories
        </h5>
    </div>
    <div class="card-body">
        <?php if (isset($_SESSION['alert_success'])): ?>
            <div class="alert alert-success alert-dismissible" role="alert">
                <?= $_SESSION['alert_success'] ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <?php unset($_SESSION['alert_success']); ?>
        <?php endif; ?>

        <?php if (isset($_SESSION['alert_error'])): ?>
            <div class="alert alert-danger alert-dismissible" role="alert">
                <?= $_SESSION['alert_error'] ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <?php unset($_SESSION['alert_error']); ?>
        <?php endif; ?>

        <div class="mb-2" align="right">
            <a href="?page=create-category" class="btn btn-primary">Create New Categories</a>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Category Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $no = 1;
                    foreach ($rows as $row) { ?>
                        <tr>
                            <td><?= $no++ ?></td>
                            <td><?= $row['name'] ?></td>
                            <td>
                                <a href="?page=create-category&id=<?= $row['id'] ?>" class="btn btn-primary btn-sm">Edit</a>
                                <a href="?page=role&action=delete&id=<?= $row['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin ingin menghapus category ini?')">Delete</a>
                            </td>
                        </tr>
                    <?php }
                    ?>

                </tbody>
            </table>
        </div>
    </div>
</div>