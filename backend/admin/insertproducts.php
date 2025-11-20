<?php include('head.php');
$controls=new htmlControl;

$mainID=$_REQUEST['mainID'];
$catID=$_REQUEST['catID'];

$query_cat = "select * from category WHERE id=$catID";
$result_cat = mysqli_query($con,$query_cat); 
$rec_found_cat = mysqli_num_rows($result_cat);
$row_cat = mysqli_fetch_array($result_cat);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('Insert '.$row_cat['title']);
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
                                            <form id="form1" name="form1" method="post" action="productsInserted.php">
                                            <tr class="gradeX">
                                                <td><input name="namee" type="text" id="namee" placeholder="Name" class="form-control" method="POST" /></td>
                                                <?php if($catID!='40' && $catID!='46' ){?>
                                                    <td><input name="price" type="text" id="price" value="0" class="form-control"/></td>
                                                    <?php }?>
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

            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


<?php include('script.php'); ?>
</body>
</html>
