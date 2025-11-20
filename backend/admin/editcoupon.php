<?php include('head.php');
$controls=new htmlControl;
$id = $_REQUEST['id'];
$query = "select * from coupon where id={$id}";
$result = mysqli_query($con,$query); 
$row = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
    <?php include('left.php');?>
    <div id="page-wrapper" class="gray-bg">
        <?php include('header.php');
        echo $controls->getHeaderSection('Edit Coupon Code');
        ?>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="tabs-container">
                        <ul class="nav nav-tabs">
                            <li class="active"><a data-toggle="tab" href="#tab-1"> Edit Discount Coupon Code</a></li>
                        </ul>
                        <form action="couponUpdated.php" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Coupon Code</label>
                                                <div class="col-sm-10">
                                                    <input name="namee" type="text" id="namee" class="form-control" value="<?php echo $row['code'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Price</label>
                                                <div class="col-sm-5">
                                                    <input name="price" type="text" id="price" class="form-control" value="<?php echo $row['price'];?>"></div>
                                                <input name="typee" type="radio" value="1" <?php if ($row['typee']==1){?>checked="checked"<?php } ?>/> Percentage
                                                <input type="radio" name="typee" value="2" <?php if ($row['typee']==2){?>checked="checked"<?php } ?>/> Net Amount</div>

                                            <div class="form-group"><label class="col-sm-2 control-label">Duration</label>
                                                <div class="col-sm-10">
                                                    <input name="duration" type="radio" value="one" <?php if ($row['duration']=="one"){?> checked="checked" <?php } ?>/> One time Use 
                                                    <input name="duration" type="radio" value="life" <?php if ($row['duration']=="life"){?> checked="checked" <?php } ?> /> Lifetime</div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Currency</label>
                                                <div class="col-sm-10">
                                                    <select name="currency" class="form-control">
                                                        <?php 
                                                        $query_cur = "select * from exchange order by name";
                                                        $result_cur = mysqli_query($con,$query_cur); 
                                                        $rec_found_cur = mysqli_num_rows($result_cur);
                                                        while($row_cur = mysqli_fetch_array($result_cur)){;
                                                            ?>
                                                            <option value="<?php echo $row_cur['currency'];?>"<?php if ($row['currency']==$row_cur['currency']){?> selected="selected"<?php } ?>><?php echo $row_cur['currency'];?></option>
                                                            <?php } ?>
                                                    </select></div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" name="id" value="<?php echo $id; ?>"><input name="Submit" type="submit" class="btn btn-block btn-outline btn-success" id="Submit" value="Update coupon" /></form>
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
