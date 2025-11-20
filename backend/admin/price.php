<?php include('head.php');
//print_r($_REQUEST);
$controls=new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage manager & writers');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <a href="insertpr.php?role=admin&ref=<?php echo $_SESSION['userName'];?>&page=price" class="btn btn-primary ">Add new Manager & Writers</a>
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
                                            <?php
                                            $query_writer = "select * from members where role= 'writer' order by id";
                                            $result_writer = mysqli_query($con,$query_writer); 
                                            $rec_found_writer = mysqli_num_rows($result_writer);
                                            while($row_writer = mysqli_fetch_array($result_writer)){ ?>
                                                <tr class="gradeX">
                                                    <td><?php echo $row_writer['namee'].' Username: '.$row_writer['username'];?></td>
                                                    <td>Role : <?php echo $row_writer['role'];?></td> 
                                                    <td>Writer ID : <?php echo $row_writer['id'];?></td> 
                                                    <td class="center">
                                                        <div class="btn-group">

                                                            <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                <a class="btn btn-primary btn-circle" href="editpr.php?id=<?php echo $row_writer['id'];?>&page=price"><i class="fa fa-edit"></i></a>
                                                            </div>

                                                            <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                <a class="btn btn-danger btn-circle" href="delpr.php?id=<?php echo $row_writer['id'];?>&page=price" onclick="return confirm('ALERT! \nAre you sure you want to delete this Coupon')"><i class="fa fa-times"></i></a>
                                                            </div>



                                                        </div>
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
</body>
</html>
