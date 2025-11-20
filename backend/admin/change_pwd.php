<?php include('head.php');
$controls=new htmlControl;
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
                                            <form id="change_pwd" name="change_pwd" method="post" action="update_pwd.php" onsubmit="return cfp();">
                                            <tr class="gradeX">
                                                <td>Enter New Password</td>
                                                <td><input name="new_pwd" type="password" id="new_pwd"  /></td>
                                                <td><input name="button" type="submit"  id="button" value="Update" /></td> 

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
