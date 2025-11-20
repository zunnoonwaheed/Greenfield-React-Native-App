<?php include('head.php');
$controls=new htmlControl;
$catID = (int)$_GET['catID']; // sanitize for safety
$query_cat = "SELECT * FROM sizee WHERE id = $catID";
$result_cat = mysqli_query($con, $query_cat);
$row_cat = mysqli_fetch_array($result_cat);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection($row_cat['name']);
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <a href="insertdow.php?catID=<?php echo $catID;?>&mainID=<?php echo $_GET['mainID'];?>" class="btn btn-primary ">Insert New Product</a>
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
                                        <thead>
                                            <tr>
                                                <th>S no</th>
                                                <th>Post</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $s=1; 
                                            $query = "select * from dow where catID=$catID order by id DESC ";
                                            $result = mysqli_query($con,$query); 
                                            $rec_found = mysqli_num_rows($result);
                                            if($rec_found >0){
                                                while($row = mysqli_fetch_array($result)){;?>
                                                    <tr class="gradeX">
                                                        <td><?php echo $s ?></td>
                                                        <td><?php echo $row['namee'];?></td>
                                                        <td class="center">
                                                            <div class="btn-group">
                                                                
                                                                
                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <a class="btn btn-primary btn-circle" href="editdow.php?id=<?php echo $row['id'];?>&catID=<?php echo $row['catID'];?>&mainID=<?php echo $_GET['mainID'];?>&imgName=<?php echo $row['imagee'];?>"><i class="fa fa-edit"></i></a>
                                                                    </div>
                                                                    
                                                                    <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <a class="btn btn-danger btn-circle" href="deldow.php?id=<?php echo $row['id'];?>&imgName=<?php echo $row['imagee'];?>&catID=<?php echo $row['catID'];?>&mainID=<?php echo $_GET['mainID'];?>" onclick="return confirm('ALERT! \nAre you sure you want to delete this Blog')"><i class="fa fa-times"></i></a>
                                                                    </div>


                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <?php $s++; }} ?>
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
