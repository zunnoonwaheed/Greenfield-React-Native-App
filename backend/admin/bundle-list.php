<?php include('head.php');
$controls=new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('Bundle List');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <a href="bundle-add.php" class="btn btn-primary">Add Bundle</a>
                                <div class="ibox-tools">
                                    <a class="collapse-link">
                                        <i class="fa fa-chevron-up"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="ibox-content">

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Items</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $q = "SELECT b.*, 
                                                         (SELECT COUNT(*) FROM bundle_items bi WHERE bi.bundle_id = b.id) as item_count 
                                                  FROM bundles b 
                                                  ORDER BY b.id DESC";
                                            $res = mysqli_query($con, $q);
                                            while($row = mysqli_fetch_assoc($res)){
                                            ?>
                                            <tr>
                                                <td><?= $row['id']; ?></td>
                                                <td><?= htmlspecialchars($row['name']); ?></td>
                                                <td><?= number_format($row['final_price']); ?></td>
                                                <td><?= $row['item_count']; ?></td>
                                                <td><?= $row['created_at'] ?? '-'; ?></td>
                                                <td>
                                                    <a href="bundle-edit.php?id=<?= $row['id']; ?>" class="btn btn-xs btn-warning">
                                                        <i class="fa fa-edit"></i> Edit
                                                    </a>
                                                    <a href="bundle-delete.php?id=<?= $row['id']; ?>" 
                                                       class="btn btn-xs btn-danger" 
                                                       onclick="return confirm('Are you sure you want to delete this bundle?');">
                                                        <i class="fa fa-trash"></i> Delete
                                                    </a>
                                                </td>
                                            </tr>
                                            <?php } ?>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>
        </div>
    </div>
</body>

<?php include('script.php'); ?>
<!-- Page-Level Scripts -->
<script>
    $(document).ready(function(){
        $('.dataTables-example').DataTable({
            pageLength: 25,
            responsive: true
        });
    });
</script>
</html>
