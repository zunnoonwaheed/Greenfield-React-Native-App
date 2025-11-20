<?php
include("../admin/includes/db_settings.php");
session_start();

$id = (int)$_GET['id'];
$bundleQ = mysqli_query($con, "SELECT * FROM bundles WHERE id='$id'");
$bundle = mysqli_fetch_assoc($bundleQ);

if(!$bundle){
    $_SESSION['error'] = "Bundle not found!";
    header("Location: bundle-list.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name        = mysqli_real_escape_string($con, $_POST['name']);
    $description = mysqli_real_escape_string($con, $_POST['description']);
    $base_price  = (float) $_POST['base_price'];
    $discount    = (float) $_POST['discount'];
    $final_price = $base_price - (($discount / 100) * $base_price);

    // Image upload
    $image = $bundle['image'];
    if (!empty($_FILES['image']['name'])) {
        $target_dir = "../uploads/bundles/";
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $image = time() . "_" . basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $image;
        move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
    }

    $status = isset($_POST['status']) ? 1 : 0;

    // Update bundle
    $query = "UPDATE bundles 
              SET name='$name', description='$description', base_price='$base_price', 
                  discount='$discount', final_price='$final_price', image='$image', status='$status' 
              WHERE id='$id'";
    
    if (mysqli_query($con, $query)) {
        // Clear old items
        mysqli_query($con, "DELETE FROM bundle_items WHERE bundle_id='$id'");

        // Re-insert items
        if (!empty($_POST['product_id'])) {
            foreach ($_POST['product_id'] as $index => $pid) {
                $qty = (int) $_POST['quantity'][$index];
                $pid = (int) $pid;
                if($pid > 0 && $qty > 0){
                    mysqli_query($con, "INSERT INTO bundle_items (bundle_id, product_id, quantity) 
                                        VALUES ('$id', '$pid', '$qty')");
                }
            }
        }

        $_SESSION['success'] = "Bundle updated successfully!";
        header("Location: bundle-list.php");
        exit;
    } else {
        $_SESSION['error'] = "Error: " . mysqli_error($con);
    }
}

// fetch bundle items
$itemsQ = mysqli_query($con, "SELECT bi.*, d.namee 
                              FROM bundle_items bi 
                              LEFT JOIN dow d ON bi.product_id = d.id 
                              WHERE bi.bundle_id='$id'");
$items = [];
while($row = mysqli_fetch_assoc($itemsQ)){ $items[] = $row; }
?>

<?php include("head.php"); ?>
<body>
<div id="wrapper">
    <?php include("left.php"); ?>
    <div id="page-wrapper" class="gray-bg">
        <?php include("header.php"); ?>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-10">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Edit Bundle</h5>
                        </div>
                        <div class="ibox-content">
                            <?php if(isset($_SESSION['error'])) { echo "<div class='alert alert-danger'>".$_SESSION['error']."</div>"; unset($_SESSION['error']); } ?>
                            <form method="POST" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label>Bundle Name</label>
                                    <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($bundle['name']); ?>" required>
                                </div>

                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea name="description" class="form-control" rows="4" required><?= htmlspecialchars($bundle['description']); ?></textarea>
                                </div>

                                <div class="form-group">
                                    <label>Base Price</label>
                                    <input type="number" step="0.01" name="base_price" class="form-control" value="<?= $bundle['base_price']; ?>" required>
                                </div>

                                <div class="form-group">
                                    <label>Discount (%)</label>
                                    <input type="number" step="0.01" name="discount" class="form-control" value="<?= $bundle['discount']; ?>" required>
                                </div>

                                <div class="form-group">
                                    <label>Current Image</label><br>
                                    <?php if($bundle['image']){ ?>
                                        <img src="../uploads/bundles/<?= $bundle['image']; ?>" width="120"><br>
                                    <?php } ?>
                                    <input type="file" name="image" class="form-control mt-2">
                                </div>

                                <div class="form-group">
                                    <label>Status</label><br>
                                    <input type="checkbox" name="status" value="1" <?= $bundle['status'] ? 'checked' : '' ?>> Active
                                </div>

                                <hr>
                                <h4>Bundle Items</h4>
                                <table class="table table-bordered" id="itemsTable">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>
                                                <button type="button" class="btn btn-success btn-sm" onclick="addRow()">+</button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if(count($items) > 0){ 
                                            foreach($items as $it){ ?>
                                                <tr>
                                                    <td>
                                                        <select name="product_id[]" class="form-control" required>
                                                            <option value="">-- Select Product --</option>
                                                            <?php
                                                            $products = mysqli_query($con, "SELECT id, namee FROM dow ORDER BY namee ASC");
                                                            while($p = mysqli_fetch_assoc($products)){
                                                                $sel = ($p['id'] == $it['product_id']) ? "selected" : "";
                                                                echo "<option value='{$p['id']}' $sel>{$p['namee']}</option>";
                                                            }
                                                            ?>
                                                        </select>
                                                    </td>
                                                    <td><input type="number" name="quantity[]" class="form-control" value="<?= $it['quantity']; ?>" required></td>
                                                    <td><button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)">x</button></td>
                                                </tr>
                                        <?php } } else { ?>
                                            <tr>
                                                <td>
                                                    <select name="product_id[]" class="form-control" required>
                                                        <?php
                                                        $products = mysqli_query($con, "SELECT id, namee FROM dow ORDER BY namee ASC");
                                                        while($p = mysqli_fetch_assoc($products)){
                                                            echo "<option value='{$p['id']}'>{$p['namee']}</option>";
                                                        }
                                                        ?>
                                                    </select>
                                                </td>
                                                <td><input type="number" name="quantity[]" class="form-control" value="1" required></td>
                                                <td><button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)">x</button></td>
                                            </tr>
                                        <?php } ?>
                                    </tbody>
                                </table>

                                <button type="submit" class="btn btn-primary">Update Bundle</button>
                                <a href="bundle-list.php" class="btn btn-default">Cancel</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php include("footer.php"); ?>
    </div>
</div>

<script>
function addRow() {
    let row = document.querySelector("#itemsTable tbody tr").cloneNode(true);
    row.querySelector("input").value = 1;
    row.querySelector("select").selectedIndex = 0;
    document.querySelector("#itemsTable tbody").appendChild(row);
}
function removeRow(btn) {
    let row = btn.closest("tr");
    if (document.querySelectorAll("#itemsTable tbody tr").length > 1) {
        row.remove();
    }
}
</script>
<?php include("script.php"); ?>
</body>
</html>
