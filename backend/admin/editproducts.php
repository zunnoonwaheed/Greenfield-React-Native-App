<?php include('head.php');
$controls=new htmlControl;
$id=$_REQUEST['id'];
$catID=$_REQUEST['catID'];
$mainID=$_REQUEST['mainID'];
$query = "select * from products where id={$id}";
$result = mysqli_query($con,$query); 
$row = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('Edit '.$row['namee']);
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <div class="ibox-tools">
                                    <a class="collapse-link">
                                        <i class="fa fa-chevron-up"></i>
                                    </a>
                                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                        <i class="fa fa-wrench"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="ibox-content">
                                <div class="">

                                </div>

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <tbody>
                                            <form id="form1" name="form1" method="post" action="productsUpdated.php">
                                            <tr class="gradeX">
                                                <td><input name="namee" type="text" id="namee" value="<?php echo $row['namee']; ?>" class="form-control" /></td>
                                                <?php if($catID!='40' && $catID!='46' ){?>
                                                    <td><input name="price" type="text" id="price" value="<?php echo $row['price']; ?>" class="form-control"/></td>
                                                    <?php }?>
                                                <input type="hidden" name="id" id="id" value="<?php echo $id; ?>" />
                                                <input type="hidden" name="catID" id="catID" value="<?php echo $catID; ?>" /><input type="hidden" name="mainID" id="mainID" value="<?php echo $mainID; ?>" />
                                                <td><input name="Submit" type="submit"  id="Submit" value="Submit" class="btn btn-primary"/></td> 

                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div><?php include('footer.php'); ?></div>
    </div>
</body>
<?php include('script.php'); ?>
</body>
</html>
