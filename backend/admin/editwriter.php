<?php include('head.php');
$controls=new htmlControl;
$id=$_GET['id'];
$statuss=$_GET['statuss'];
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage password');
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
                                            <form method="post" action="writerUpdate1.php" onsubmit="return cfp();">
                                            <tr class="gradeX">
                                                <td>Please Assign Writer</td>
                                                <td><select name="writerID" class="form-control">
                                                        <option selected="selected">Please Assign Writer</option>
                                                        <?php

                                                        $query_writer = "select * from members where role= 'writer' ORDER by namee";
                                                        $result_writer = mysqli_query($con,$query_writer); 
                                                        $rec_found_writer = mysqli_num_rows($result_writer);
                                                        while($row_writer = mysqli_fetch_array($result_writer)){
                                                            ?>
                                                            <option value="<?php echo $row_writer['id']?>"><?php echo $row_writer['namee'].' Username: '.$row_writer['username'];?></option>
                                                            <?php } ?>
                                                    </select></td>
                                                <td>
                                                    <input type="hidden" name="id" value="<?php echo $id ; ?>"  />
                                                    <input type="hidden" name="statuss" value="<?php echo $statuss ; ?>"  />
                                                    <input name="Submit" type="submit"  class="btn btn-primary" value="Update Writer" /></td> 

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
<script language="javascript">
    function cfp(){


        if (document.change_pwd.new_pwd.value==""){
            alert("Please Enter New Password!");
            document.change_pwd.new_pwd.value="";
            document.change_pwd.new_pwd.focus();
            return false;
        }

        return true;
    }
</script>
</body>
</html>
