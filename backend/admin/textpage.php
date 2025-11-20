<?php include('head.php');
$controls=new htmlControl;
$tp_id = $_REQUEST['pageID'];
function show_tp($tp_id){      
    if ($tp_id!=""){
        $query = "select * from textpage where id={$tp_id}";
        $result = mysqli_query($con,$query); 
        return $row = mysqli_fetch_array($result);
    }
} echo basename($_SERVER['PHP_SELF']);?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            $heading=show_tp($tp_id);
            echo $controls->getHeaderSection($heading['namee']);
            ?>           
            <div class="col-lg-12">
                <div class="ibox">
                    <div class="ibox-title">
                    <?php $data=show_tp($tp_id);?>

                        <!--<a href="edit_tp1.php?pageID=<?php //echo $tp_id; ?>" class="btn btn-primary">Edit Data</a>-->
                        <a href="edit_tp1.php?pageID=<?php echo $tp_id;?>&imgName=<?php echo $data['imagee'];?>&imgName1=<?php echo $data['image2'];?>" class="btn btn-primary">Edit Data</a>
                        <div class="ibox-tools">
                            <a class="collapse-link">
                                <i class="fa fa-chevron-up"></i>
                            </a>
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                <i class="fa fa-wrench"></i>
                            </a>
                        </div>
                    </div>
                    <div class="ibox">
                        <div class="ibox-title">

                            

                            <div class="ibox-tool">
                                <p><?php echo $data['pageData'];?>
                                </p></div>
                        </div>
                    </div>

                </div></div>


            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


<?php include('script.php'); ?>
</body>
</html>
