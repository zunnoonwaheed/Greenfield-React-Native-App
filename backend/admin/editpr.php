<?php include('head.php');
$controls=new htmlControl;
$id = $_REQUEST['id'];
$query = "select * from members  where id={$id}";
$result = mysqli_query($con,$query); 
$row = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('Edit '.$row['role']);
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Edit <?php echo $row['role']; ?></a></li>
                            </ul>
                            <form action="prUpdated.php" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Full Name</label>
                                                <div class="col-sm-10">
                                                    <input name="namee" type="text" id="namee" class="form-control" value="<?php echo $row['namee'];?>" required>
                                                </div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Username / Email</label>
                                                <div class="col-sm-10">
                                                    <input name="username" type="text" id="username" value="<?php echo $row['username'];?>" class="form-control" required></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Password</label>
                                                <div class="col-sm-10">
                                                    <input name="password" type="password" id="password1" class="form-control" required></div>
                                            </div>
                                            <?php if($_GET['page']=='subadmin') {
                                                $query_role = "select * from menu limit 15";
                                                $result_role = mysqli_query($con,$query_role); 

                                                while($row_role = mysqli_fetch_array($result_role)){
                                                    ?><div class="i-checks">
                                                        <label> <input type="checkbox" value="<?php echo $row_role['id']; ?>" name="access[]" > <i></i> <?php echo $row_role['namee']; ?> </label></div>
                                                    <?php  } 
                                            } ?>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="id" id="id" value="<?php echo $id; ?>">
                        <input type="hidden" name="page" value="<?php echo ($_GET['page'])?>" >
                        <input name="Submit" type="submit" class="btn btn-block btn-outline btn-success" value="Update <?php echo $row['role'];?>" />
                        </form>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


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
</html>
