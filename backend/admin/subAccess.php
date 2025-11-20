<?php include('head.php');
$controls=new htmlControl;
if(isset($_POST['update'])){
    $query = "UPDATE menu SET status = '0'";//all zero
    mysqli_query($con,$query);
    foreach ($_POST['role'] as $id)   
    {
        $query = "UPDATE menu SET status = '1' WHERE menuid = '$id'";//selected status
        mysqli_query($con,$query);
    }
}
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('sub-admin role');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-content">
                                <form method="post" action="">
                                    <?php
                                    $query_role = "select * from menu limit 15";
                                    $result_role = mysqli_query($con,$query_role); 
                                    while($row_role = mysqli_fetch_array($result_role)){
                                        ?>

                                        <div class="i-checks">
                                            <label> <input type="checkbox" value="<?php echo $row_role['id']; ?>" name="role[]" <?php if($row_role['status']==1){echo 'checked';}?>> <i></i> <?php echo $row_role['namee']; ?> </label></div>
                                        <?php  } ?>
                                    <input type="submit" name="update" value="Update Access" class="form-control btn-success">
                                </form>

                            </div>
                        </div>
                    </div>
                </div></div>

            <?php include('footer.php'); ?>

        </div>
    </div>
    <?php include('script.php'); ?>

    <link href="css/plugins/iCheck/custom.css" rel="stylesheet">
    <link href="css/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css" rel="stylesheet">
    <script src="js/plugins/iCheck/icheck.min.js"></script>
    <script>
        $(document).ready(function () {
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        });
    </script>
</body>
</html>
