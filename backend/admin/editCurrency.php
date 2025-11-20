<?php include('head.php');
$controls=new htmlControl;
$id=$_REQUEST['id'];
$query = "select * from exchange where id={$id}";
$result = mysqli_query($con,$query);
$row = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('Edit currency');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Edit Currency</a></li>
                            </ul>
                            <form action="currencyUpdated.php" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Name</label>
                                                <div class="col-sm-10">
                                                    <input name="namee" type="text" id="namee" value="<?php echo $row['name']; ?>" class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Symbol</label>
                                                <div class="col-sm-10">
                                                    <input name="currency" type="text" id="currency" value="<?php echo $row['currency']; ?>" class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Rate</label>
                                                <div class="col-sm-10">
                                                    <input name="exchange_rate" type="text" id="exchange_rate" value="<?php echo $row['exchange_rate']; ?>" class="form-control" >
                                                    <span class="btn-warning">should be upto two decimal places like 0.75</span></div>
                                            </div>

                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="id" id="id" value="<?php echo $id; ?>" />
                        <input name="Submit" type="submit" class="btn btn-block btn-outline btn-success" value="Update Currency" /></form>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


<?php include('script.php'); ?>    
</body>
</html>
