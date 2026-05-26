<?php
$id = isset($_GET['id']) ? mysqli_real_escape_string($koneksi, $_GET['id']) : '';
$isEdit = !empty($id);

$nameVal = '';
$error = '';

if ($isEdit) {
    $query = mysqli_query($koneksi, "SELECT * FROM categories WHERE id = '$id'");
    $category = mysqli_fetch_assoc($query);
    if ($category) {
        $nameVal = $category['name'];
    } else {
        $error = "Category tidak ditemukan.";
    }
}

if (isset($_POST['simpan_data'])) {
    $nameVal = mysqli_real_escape_string($koneksi, $_POST['name']);

    if (empty($nameVal)) {
        $error = "Nama harus diisi!";
    } else {
        if ($isEdit) {
            try {
                $update = mysqli_query($koneksi, "UPDATE categories SET name='$nameVal' WHERE id='$id'");

                if ($update) {
                    $_SESSION['alert_success'] = "Category berhasil diperbarui!";
                    header("Location: ?page=category");
                    exit();
                } else {
                    $error = "Gagal mengupdate category: " . mysqli_error($koneksi);
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
                $insert = mysqli_query($koneksi, "INSERT INTO categories (name) VALUES ('$nameVal')");
                if ($insert) {
                    $_SESSION['alert_success'] = "Category berhasil ditambahkan!";
                    header("Location: ?page=category");
                    exit();
                } else {
                    $error = "Gagal menambahkan category: " . mysqli_error($koneksi);
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
?>

<div class="card">
    <div class="card-header">
        <h5 class="card-title"><?= $isEdit ? 'Edit Category' : 'Create Category' ?></h5>
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
            <div class="mt-4">
                <button type="submit" name="simpan_data" class="btn btn-primary me-2">Submit</button>
                <a href="?page=category" class="btn btn-outline-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>