<?php
// Initialize variables
$id = isset($_GET['id']) ? mysqli_real_escape_string($koneksi, $_GET['id']) : '';
$isEdit = !empty($id);

$nameVal = '';
$emailVal = '';
$passwordVal = '';
$error = '';

// If in edit mode, fetch the user data
if ($isEdit) {
    $query = mysqli_query($koneksi, "SELECT * FROM users WHERE id = '$id'");
    $user = mysqli_fetch_assoc($query);
    if ($user) {
        $nameVal = $user['name'];
        $emailVal = $user['email'];
    } else {
        $error = "User tidak ditemukan.";
        $isEdit = false; // Fallback to create mode
    }
}

// Process form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nameVal = mysqli_real_escape_string($koneksi, $_POST['name']);
    $emailVal = mysqli_real_escape_string($koneksi, $_POST['email']);
    $passwordVal = $_POST['password'];
    $confPassword = $_POST['conf-password'];

    // Basic validation
    if (empty($nameVal) || empty($emailVal)) {
        $error = "Nama dan Email harus diisi!";
    } elseif (!$isEdit && empty($passwordVal)) {
        $error = "Password harus diisi!";
    } elseif (!empty($passwordVal) && $passwordVal !== $confPassword) {
        $error = "Password dan Confirm Password tidak cocok!";
    } else {
        if ($isEdit) {
            // Update user (check if password is changed)
            if (!empty($passwordVal)) {
                $passwordHash = password_hash($passwordVal, PASSWORD_DEFAULT);
                $update = mysqli_query($koneksi, "UPDATE users SET name='$nameVal', email='$emailVal', password='$passwordHash' WHERE id='$id'");
            } else {
                $update = mysqli_query($koneksi, "UPDATE users SET name='$nameVal', email='$emailVal' WHERE id='$id'");
            }

            if ($update) {
                $_SESSION['alert_success'] = "User berhasil diperbarui!";
                header("Location: ?page=user");
                exit();
            } else {
                $error = "Gagal mengupdate user: " . mysqli_error($koneksi);
            }
        } else {
            // Check if email already exists
            $checkEmail = mysqli_query($koneksi, "SELECT * FROM users WHERE email='$emailVal'");
            if (mysqli_num_rows($checkEmail) > 0) {
                $error = "Email sudah terdaftar!";
            } else {
                // Create user
                $passwordHash = password_hash($passwordVal, PASSWORD_DEFAULT);
                $insert = mysqli_query($koneksi, "INSERT INTO users (name, email, password) VALUES ('$nameVal', '$emailVal', '$passwordHash')");
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
    <div class="card-header text-center">
        <h2 class="card-title"><?= $isEdit ? 'Edit User' : 'Create User' ?></h2>
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
                <label for="password" class="form-label">Password <?= $isEdit ? '<small class="text-muted">(Kosongkan jika tidak ingin mengubah)</small>' : '' ?></label>
                <input type="password" name="password" id="password" class="form-control" <?= $isEdit ? '' : 'required' ?>>
            </div>
            <div class="mb-3">
                <label for="conf-password" class="form-label">Confirm Password <?= $isEdit ? '<small class="text-muted">(Kosongkan jika tidak ingin mengubah)</small>' : '' ?></label>
                <input type="password" name="conf-password" id="conf-password" class="form-control" <?= $isEdit ? '' : 'required' ?>>
            </div>
            <div class="mt-4">
                <button type="submit" class="btn btn-primary me-2">Submit</button>
                <a href="?page=user" class="btn btn-outline-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>