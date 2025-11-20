<?php
include("../admin/includes/db_settings.php");
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name        = mysqli_real_escape_string($con, $_POST['name']);
    $description = mysqli_real_escape_string($con, $_POST['description']);
    $base_price  = (float) $_POST['base_price'];
    $discount    = (float) $_POST['discount'];
    $final_price = $base_price - (($discount / 100) * $base_price);

    // Image upload
    $image = "";
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

    // Insert bundle
    $query = "INSERT INTO bundles (name, description, base_price, discount, final_price, image, status, created_at)
              VALUES ('$name', '$description', '$base_price', '$discount', '$final_price', '$image', '$status', NOW())";
    
    if (mysqli_query($con, $query)) {
        $bundle_id = mysqli_insert_id($con);

        // Insert bundle items
        if (!empty($_POST['product_id'])) {
            foreach ($_POST['product_id'] as $index => $pid) {
                $qty = (int) $_POST['quantity'][$index];
                $pid = (int) $pid;
                mysqli_query($con, "INSERT INTO bundle_items (bundle_id, product_id, quantity) 
                                    VALUES ('$bundle_id', '$pid', '$qty')");
            }
        }

        $_SESSION['success'] = "Bundle added successfully!";
        header("Location: bundle-list.php");
        exit;
    } else {
        $_SESSION['error'] = "Error: " . mysqli_error($con);
    }
}
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
                            <h5>Add New Bundle</h5>
                        </div>
                        <div class="ibox-content">
                            <?php if(isset($_SESSION['error'])) { echo "<div class='alert alert-danger'>".$_SESSION['error']."</div>"; unset($_SESSION['error']); } ?>
                            <form method="POST" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label>Bundle Name</label>
                                    <input type="text" name="name" class="form-control" required>
                                </div>

                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea name="description" class="form-control" rows="4" required></textarea>
                                </div>

                                <div class="form-group">
                                    <label>Base Price</label>
                                    <input type="number" step="0.01" name="base_price" class="form-control" required>
                                </div>

                                <div class="form-group">
                                    <label>Discount (%)</label>
                                    <input type="number" step="0.01" name="discount" class="form-control" required>
                                </div>

                                <div class="form-group">
                                    <label>Image</label>
                                    <input type="file" name="image" class="form-control">
                                </div>

                                <div class="form-group">
                                    <label>Status</label><br>
                                    <input type="checkbox" name="status" value="1"> Active
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
                                    </tbody>
                                </table>

                                <button type="submit" class="btn btn-primary">Save Bundle</button>
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
