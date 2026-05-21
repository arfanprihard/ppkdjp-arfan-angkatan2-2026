<?php
$id = isset($_GET['id']) ? mysqli_real_escape_string($koneksi, $_GET['id']) : '';
$isEdit = !empty($id);

$nameVal = '';
$isActiveVal = '';
$descriptionVal = '';
$error = '';

if ($isEdit) {
    $query = mysqli_query($koneksi, "SELECT * FROM roles WHERE id = '$id'");
    $role = mysqli_fetch_assoc($query);
    if ($role) {
        $nameVal = $role['name'];
        $isActiveVal = $role['is_active'];
        $descriptionVal = $role['description'];
    } else {
        $error = "Role tidak ditemukan.";
    }
}

if (isset($_POST['simpan_data'])) {
    $nameVal = mysqli_real_escape_string($koneksi, $_POST['name']);
    $isActiveVal = isset($_POST['is_active']) ? mysqli_real_escape_string($koneksi, $_POST['is_active']) : '';
    $descriptionVal = mysqli_real_escape_string($koneksi, $_POST['description']);

    if (empty($nameVal) || $isActiveVal === '') {
        $error = "Nama dan Status harus diisi!";
    } else {
        if ($isEdit) {
            $update = mysqli_query($koneksi, "UPDATE roles SET name='$nameVal', is_active='$isActiveVal', description='$descriptionVal' WHERE id='$id'");

            if ($update) {
                $_SESSION['alert_success'] = "Role berhasil diperbarui!";
                header("Location: ?page=role");
                exit();
            } else {
                $error = "Gagal mengupdate role: " . mysqli_error($koneksi);
            }
        } else {
            $insert = mysqli_query($koneksi, "INSERT INTO roles (name, is_active, description) VALUES ('$nameVal', '$isActiveVal', '$descriptionVal')");
            if ($insert) {
                $_SESSION['alert_success'] = "Role berhasil ditambahkan!";
                header("Location: ?page=role");
                exit();
            } else {
                $error = "Gagal menambahkan role: " . mysqli_error($koneksi);
            }
        }
    }
}
?>

<div class="card">
    <div class="card-header">
        <h5 class="card-title"><?= $isEdit ? 'Edit Role' : 'Create Role' ?></h5>
    </div>
    <div class="card-body">
        <?php if (!empty($error)): ?>
            <div class="alert alert-danger alert-dismissible" role="alert">
                <?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <form action="" method="POST">
            <div class="mb-3">
                <label for="name" class="form-label">Nama</label>
                <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($nameVal) ?>">
            </div>
            <div>
                <div>
                    <div class="mb-3">
                        <label for="" class="form-label">Is Active</label> <br>
                        <input type="radio" name="is_active" value="1" <?= $isActiveVal === "1" ? 'checked' : '' ?>> Active
                        <input type="radio" name="is_active" value="0" <?= $isActiveVal === "0" ? 'checked' : '' ?>> Inactive
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Description</label>
                        <textarea type="text" name="description" class="form-control" value=""></textarea>
                    </div>
                </div>
                <div class="mt-4">
                    <button type="submit" name="simpan_data" class="btn btn-primary me-2">Submit</button>
                    <a href="?page=role" class="btn btn-outline-secondary">Cancel</a>
                </div>
        </form>
    </div>
</div>