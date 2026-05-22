<?php
$id = isset($_GET['id']) ? mysqli_real_escape_string($koneksi, $_GET['id']) : '';
$isEdit = !empty($id);

$nameVal = '';
$parentVal = '';
$urlVal = '';
$iconVal = '';
$sortOrderVal = '';
$isActiveVal = '';
$error = '';

if ($isEdit) {
    $query = mysqli_query($koneksi, "SELECT * FROM menus WHERE id = '$id'");
    $menu = mysqli_fetch_assoc($query);
    if ($menu) {
        $nameVal = $menu['name'];
        $parentVal = $menu['id_parent'] ?: 'NULL';
        $urlVal = $menu['url'] ?: 'NULL';
        $iconVal = $menu['icon'];
        $sortOrderVal = $menu['sort_order'];
        $isActiveVal = $menu['is_active'];
    } else {
        $error = "Menu tidak ditemukan.";
    }
}

if (isset($_POST['simpan_data'])) {
    $nameVal = mysqli_real_escape_string($koneksi, $_POST['name']);
    $parentVal = mysqli_real_escape_string($koneksi, $_POST['id_parent']) ?: 'NULL';
    $urlVal = mysqli_real_escape_string($koneksi, $_POST['url']) ?: NULL;
    $iconVal = mysqli_real_escape_string($koneksi, $_POST['icon']);
    $sortOrderVal = mysqli_real_escape_string($koneksi, $_POST['sort_order']);
    $isActiveVal = isset($_POST['is_active']) ? mysqli_real_escape_string($koneksi, $_POST['is_active']) : '';

    if (empty($nameVal) || $isActiveVal === '' || empty($sortOrderVal) || empty($iconVal)) {
        $error = "Nama, Icon, SortOrder, dan Status harus diisi!";
    } else {
        if ($isEdit) {
            $update = mysqli_query($koneksi, "UPDATE menus SET id_parent='$parentVal',name='$nameVal', url='$urlVal', icon='$iconVal', sort_order='$sortOrderVal', is_active='$isActiveVal' WHERE id='$id'");

            if ($update) {
                $_SESSION['alert_success'] = "Menu berhasil diperbarui!";
                header("Location: ?page=menu");
                exit();
            } else {
                $error = "Gagal mengupdate menu: " . mysqli_error($koneksi);
            }
        } else {
            $insert = mysqli_query($koneksi, "INSERT INTO menus (id_parent,name, url, icon, sort_order, is_active) VALUES ($parentVal,'$nameVal', '$urlVal', '$iconVal', '$sortOrderVal', '$isActiveVal')");
            if ($insert) {
                $_SESSION['alert_success'] = "Menu berhasil ditambahkan!";
                header("Location: ?page=menu");
                exit();
            } else {
                $error = "Gagal menambahkan menu: " . mysqli_error($koneksi);
            }
        }
    }
}
?>

<div class="card">
    <div class="card-header">
        <h5 class="card-title"><?= $isEdit ? 'Edit Menu' : 'Create Menu' ?></h5>
    </div>
    <div class="card-body">
        <?php if (!empty($error)): ?>
            <div class="alert alert-danger alert-dismissible" role="alert">
                <?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <form action="" method="POST">

            <div class="row">
                <div class="mb-3 col-6">
                    <label for="name" class="form-label">Nama *</label>
                    <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($nameVal) ?>">
                </div>
                <div class="mb-3 col-6">
                    <label for="name" class="form-label">Parent ID</label>
                    <select name="id_parent" class="form-control">
                        <option value="">-- Pilih Parent Menu --</option>

                        <?php
                        $menus = mysqli_query($koneksi, "SELECT * FROM menus ORDER BY name ASC");

                        while ($menu = mysqli_fetch_assoc($menus)) {
                            if (empty($menu['id_parent']) && empty($menu['url'])) {
                        ?>
                                <option value="<?= $menu['id'] ?>">
                                    <?= $menu['name'] ?>
                                </option>
                        <?php }
                        } ?>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="mb-3 col-6">
                    <label for="url" class="form-label">URL</label>
                    <input type="text" name="url" class="form-control" value="<?= htmlspecialchars($urlVal) ?>">
                </div>
                <div class="mb-3 col-6">
                    <label for="icon" class="form-label">ICON *</label>
                    <input type="text" name="icon" class="form-control" value="<?= htmlspecialchars($iconVal) ?>">
                </div>
            </div>
            <div class="row">
                <div class="mb-3 col-6">
                    <label for="sort_order" class="form-label">SORT ORDER *</label>
                    <input type="number" name="sort_order" class="form-control" value="<?= htmlspecialchars($sortOrderVal) ?>">
                </div>
                <div class="mb-3 col-6">
                    <label for="" class="form-label">Is Active</label> <br>
                    <div class="h-100">
                        <input type="radio" name="is_active" value="1" <?= $isActiveVal === "1" ? 'checked' : '' ?>> Active
                        <input type="radio" name="is_active" value="0" <?= $isActiveVal === "0" ? 'checked' : '' ?>> Inactive

                    </div>
                </div>
            </div>
            <div class="mt-4">
                <button type="submit" name="simpan_data" class="btn btn-primary me-2">Submit</button>
                <a href="?page=menu" class="btn btn-outline-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>