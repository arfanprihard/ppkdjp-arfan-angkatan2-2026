<?php
$id = isset($_GET['id']) ? mysqli_real_escape_string($koneksi, $_GET['id']) : '';
$isEdit = !empty($id);

$nameVal = '';
$emailVal = '';
$passwordVal = '';
$roleIdVal = '';
$error = '';

if ($isEdit) {
    $query = mysqli_query($koneksi, "SELECT * FROM users WHERE id = '$id'");
    $user = mysqli_fetch_assoc($query);
    if ($user) {
        $nameVal = $user['name'];
        $emailVal = $user['email'];
        $roleIdVal = $user['role_id'];
    } else {
        $error = "User tidak ditemukan.";
    }
}

if (isset($_POST['simpan_data'])) {
    $nameVal = mysqli_real_escape_string($koneksi, $_POST['name']);
    $emailVal = mysqli_real_escape_string($koneksi, $_POST['email']);
    $passwordVal = $_POST['password'];
    $confPassword = $_POST['conf-password'];
    $roleIdVal = mysqli_real_escape_string($koneksi, $_POST['role_id']);

    if (empty($nameVal) || empty($emailVal) || empty($roleIdVal)) {
        $error = "Nama, Email, dan Role harus diisi!";
    } elseif (!$isEdit && empty($passwordVal)) {
        $error = "Password harus diisi!";
    } elseif (!empty($passwordVal) && $passwordVal !== $confPassword) {
        $error = "Password dan Confirm Password tidak cocok!";
    } else {
        if ($isEdit) {
            if (!empty($passwordVal)) {
                $passwordHash = password_hash($passwordVal, PASSWORD_DEFAULT);
                $update = mysqli_query($koneksi, "UPDATE users SET name='$nameVal', email='$emailVal', password='$passwordHash', role_id='$roleIdVal' WHERE id='$id'");
            } else {
                $update = mysqli_query($koneksi, "UPDATE users SET name='$nameVal', email='$emailVal', role_id='$roleIdVal' WHERE id='$id'");
            }

            if ($update) {
                $_SESSION['alert_success'] = "User berhasil diperbarui!";
                header("Location: ?page=user");
                exit();
            } else {
                $error = "Gagal mengupdate user: " . mysqli_error($koneksi);
            }
        } else {
            $checkEmail = mysqli_query($koneksi, "SELECT * FROM users WHERE email='$emailVal'");
            if (mysqli_num_rows($checkEmail) > 0) {
                $error = "Email sudah terdaftar!";
            } else {
                $passwordHash = password_hash($passwordVal, PASSWORD_DEFAULT);
                $insert = mysqli_query($koneksi, "INSERT INTO users (name, email, password, role_id) VALUES ('$nameVal', '$emailVal', '$passwordHash', '$roleIdVal')");
                if ($insert) {
                    $_SESSION['alert_success'] = "User berhasil ditambahkan!";
                    header("Location: ?page=user");
                    exit();
                } else {
                    $error = "Gagal menambahkan user: " . mysqli_error($koneksi);
                }
            }
        }
    }
}
?>

<div class="card">
    <div class="card-header">
        <h5 class="card-title"><?= $isEdit ? 'Edit User' : 'Create User' ?></h5>
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
                <input type="text" name="name" id="name" class="form-control" value="<?= htmlspecialchars($nameVal) ?>" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" name="email" id="email" class="form-control" value="<?= htmlspecialchars($emailVal) ?>" required>
            </div>
            <div class="mb-3">
                <label for="role_id" class="form-label">Role</label>
                <select name="role_id" id="role_id" class="form-control" required>
                    <option value="">-- Pilih Role --</option>
                    <?php
                    $roles = mysqli_query($koneksi, "SELECT * FROM roles WHERE is_active = '1' ORDER BY name ASC");
                    while ($role = mysqli_fetch_assoc($roles)) {
                    ?>
                        <option value="<?= $role['id'] ?>" <?= $roleIdVal == $role['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($role['name']) ?>
                        </option>
                    <?php } ?>
                </select>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password <?= $isEdit ? '<small class="text-muted">(Kosongkan jika tidak ingin mengubah)</small>' : '' ?></label>
                <input type="password" name="password" id="password" class="form-control" <?= $isEdit ? '' : 'required' ?>>
            </div>
            <div class="mb-3">
                <label for="conf-password" class="form-label">Confirm Password <?= $isEdit ? '<small class="text-muted">(Kosongkan jika tidak ingin mengubah)</small>' : '' ?></label>
                <input type="password" name="conf-password" id="conf-password" class="form-control" <?= $isEdit ? '' : 'required' ?>>
            </div>
            <div class="mt-4">
                <button type="submit" name="simpan_data" class="btn btn-primary me-2">Submit</button>
                <a href="?page=user" class="btn btn-outline-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>