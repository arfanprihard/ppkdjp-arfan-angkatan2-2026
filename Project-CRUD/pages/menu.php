<?php
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $delete_id = mysqli_real_escape_string($koneksi, $_GET['id']);
    if (mysqli_query($koneksi, "DELETE FROM menus WHERE id = '$delete_id'")) {
        $_SESSION['alert_success'] = "Menu berhasil dihapus!";
    } else {
        $_SESSION['alert_error'] = "Gagal menghapus menu: " . mysqli_error($koneksi);
    }
    header("Location: ?page=menu");
    exit();
}
$selectMenus = mysqli_query($koneksi, "SELECT menus.*, parent.name AS parent_name FROM menus LEFT JOIN menus AS parent ON parent.id = menus.id_parent ORDER BY menus.id DESC");
$rows = mysqli_fetch_all($selectMenus, MYSQLI_ASSOC);
?>
<div class="card">
    <div class="card-header">
        <h5>

            Manage Menus
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
            <a href="?page=create-menu" class="btn btn-primary">Create New Menu</a>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Parent</th>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Icon</th>
                        <th>Order</th>
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
                            <td><?= $row['parent_name'] ?></td>
                            <td><?= $row['name'] ?></td>
                            <td><?= $row['url'] ?></td>
                            <td>
                                <div class="<?= $row['icon'] ?>"></div>
                            </td>
                            <td><?= $row['sort_order'] ?></td>
                            <td><?= $row['is_active'] == "1" ? '<div class="text-primary">Active</div>' : '<div class="text-danger">Inactive</div>' ?></td>
                            <td>
                                <a href="?page=create-menu&id=<?= $row['id'] ?>" class="btn btn-primary btn-sm">Edit</a>
                                <a href="?page=menu&action=delete&id=<?= $row['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin ingin menghapus menu ini?')">Delete</a>
                            </td>
                        </tr>
                    <?php }
                    ?>

                </tbody>
            </table>
        </div>
    </div>
</div>