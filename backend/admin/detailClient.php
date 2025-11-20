<?php include('head.php');
$controls=new htmlControl;
@$catID=$_POST['catID'];
@$id=$_GET['id'];
@$email=$_GET['email'];
if (isset($id)){
    $query3 = "select * from profile where id=$id";
}else{
    $query3 = "select * from profile where email2='$email'";
}
$result3 = mysqli_query($con,$query3); 
$rec_found3 = mysqli_num_rows($result3);
$row3 = mysqli_fetch_array($result3);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('client detail');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">

                            <div class="ibox-content">
                                <div class="">

                                </div>

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <tbody>
                                            <tr class="gradeX">
                                                <td>First Name</td>
                                                <td><?php echo $row3['namee'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td>Last Name</td>
                                                <td><?php echo $row3['last_name'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td>Email</td>
                                                <td><?php echo $row3['email2'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td>Password</td>
                                                <td><?php echo $row3['password'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td>Allow Night Calls</td>
                                                <td><?php echo $row3['night_call'];?></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td>Contact</td>
                                                <td><?php echo $row3['contact'];?></td>
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


<!-- Mirrored from webapplayers.com/inspinia_admin-v2.5/table_data_tables.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 26 May 2016 13:15:49 GMT -->
</html>
