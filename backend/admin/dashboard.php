<?php include('head.php');
$controls=new htmlControl;
$id = 0;
if(isset($_GET['id']))  
    $id = filter_var($_GET['id'],
        FILTER_VALIDATE_INT, 
        array('options'=>array('default'=>$id, 'min_range'=>0, 'max_range'=>99999999)));

//fetch valid person
$query = "select * from cart where id ='$id'";
//echo $query3;
$result = mysqli_query($con,$query); 
$rec_found = mysqli_num_rows($result);
$row = mysqli_fetch_array($result);

//fetch topic
$query_meta = "select * from products where id=".$row['topic']."";
//echo $query;
$result_meta = mysqli_query($con,$query_meta); 
$row_meta = mysqli_fetch_array($result_meta);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('Conversation for Order # EW1-'.$row['id']. ' Topic: '.$row_meta['namee']);
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">

                            <div class="ibox-content">
                                <div class="row">
                                    <div class="col-md-12">
                                        <!-- view message -->
                                        <?php 
                                        $query1 = "select * from dashboard where pid ='$id' order by id DESC";
                                        //echo $query3;
                                        $result1 = mysqli_query($con,$query1); 
                                        $rec_found1 = mysqli_num_rows($result1);
                                        while($row1 = mysqli_fetch_array($result1)){

                                            $ins_query_img = "UPDATE dashboard SET status = 1 WHERE id=".$row1['id']." AND email <> 'admin' AND role='user'";

                                            if (!mysqli_query($con,$ins_query_img))
                                            {
                                                die('Error: ' . mysqli_error($con));
                                            }   
                                            $ins_query_img = "UPDATE dashboard SET status = 1 WHERE id=".$row1['id']." AND email <> 'admin' AND role='writer'";

                                            if (!mysqli_query($con,$ins_query_img))
                                            {
                                                die('Error: ' . mysqli_error($con));
                                            }
                                            $query_meta1 = "select * from profile where email2='".$row['email']."'";
                                            //echo $query;
                                            $result_meta1 = mysqli_query($con,$query_meta1); 
                                            $row_meta1 = mysqli_fetch_array($result_meta1);
                                            $fname=$row_meta1['namee'];
                                            ?>
                                            <div class="col-md-6">
                                                <div class="panel-group payments-method" id="accordion">

                                                    <div class="panel <?php if ($row1['email']=="admin"){ 
                                                            echo 'panel-warning'; } else if ($row1['role']=='writer'){echo 'panel-success';}else {echo 'panel-info';} ?>">
                                                        <div class="panel-heading">
                                                            <div class="pull-right">
                                                                <?php $newvalue = date('jS F, Y \a\t H:i:s', strtotime($row1['datee']));
                                                                echo $newvalue; ?>
                                                            </div>
                                                            <h5 class="panel-title">
                                                                <a data-toggle="collapse" data-parent="#accordion" href="#collapse<?php echo $row1['id']; ?>">

                                                                    <?php 
                                                                    if (($row1['role']=='user')&&$row1['email']!='admin'){
                                                                        echo $fname; }
                                                                    else if (($row1['role']=='writer')&&($row1['email']!="admin")){?>Writer<?php } 
                                                                        else if($row1['role']=='user'&& $row1['email']=='admin'){?>Administrator To User <?php }
                                                                            else if($row1['role']=='writer' && $row1['email']=='admin'){?>Administrator To Writer<?php }
                                                                    ?>
                                                                </a>
                                                            </h5>

                                                        </div>

                                                        <div id="collapse<?php echo $row1['id']; ?>" class="panel-collapse collapse in">
                                                            <div class="panel-body">

                                                                <div class="row">
                                                                    <div class="col-md-4">
                                                                        <?php if ($row1['email']=="admin"){?>
                                                                            <img src="images/admin.png" class=
                                                                                "img-circle"  width="100" height="150"> <?php } 
                                                                        else if ($row1['role']=='user'){ ?>  
                                                                            <img src="images/customer.png" class=
                                                                                "img-circle" width="100" height="150"> <?php }
                                                                        else if ($row1['role']=='writer'){ ?><img src="images/manager.png" class=
                                                                            "img-circle" width="100" height="150"> <?php } ?>

                                                                    </div>
                                                                    <div class="col-md-8">

                                                                        <p><?php echo $row1['message']?></p>
<div style="clear:both"></div>
<?php if ($row1['file1']!=""){?>
<a href="upload/order/<?php echo $row['shopID']?>/<?php echo $row1['file1'];?>" class="downloadbutton">Download File1</a>
<?php } ?>
<?php if ($row1['file2']!=""){?>
<a href="upload/order/<?php echo $row['shopID']?>/<?php echo $row1['file2'];?>" class="downloadbutton">Download File2</a>
<?php } ?>
<?php if ($row1['file3']!=""){?>
<a href="upload/order/<?php echo $row['shopID']?>/<?php echo $row1['file3'];?>" class="downloadbutton">Download File3</a>
<?php } ?>
                                                                    </div>

                                                                </div>






                                                            </div>
                                                        </div>
                                                    </div>
                                                </div></div>
                                        <?php } ?></div></div>
                                <!-- Send message -->
                                <div class="panel-group payments-method" id="accordion">

                                    <div class="panel panel-primary">
                                        <div class="panel-heading">
                                            <h5 class="panel-title">
                                                <a data-toggle="collapse" data-parent="#accordion" href="#message">Send Your message</a>
                                            </h5>
                                        </div>
                                        <div id="message" class="panel-collapse collapse in">
                                            <div class="panel-body">

                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <img src="images/admin.png">
                                                    </div>
                                                    <div class="col-md-8">

                                                        <form action="dashboardInserted.php" enctype="multipart/form-data" method="post">
                                                            <div class="row">
                                                                <div class="col-xs-12">
                                                                    <div class="form-group">
                                                                        <label>Message for</label>
                                                                        <div class="input-group">
                                                                            <select name="role" class="form-control">
                                                                                <option value="">SELCET ONE</option>
                                                                                <option value="writer">WRITER</option>
                                                                                <option value="user">USER</option>
                                                                            </select>
                                                                            <span class="input-group-addon"><i class="fa fa-users"></i></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-xs-12 col-md-12">
                                                                    <div class="form-group">
                                                                        <label>Description</label>
                                                                        <textarea name="message" class="form-control"></textarea>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div class="row">
                                                                <div class="col-xs-12">
                                                                    <div class="col-xs-3">
                                                                        <div class="form-group">
                                                                            <label>Amount</label>
                                                                            <input type="text" class="form-control" name="amount" id="amount" value="0"  required/>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-xs-3">
                                                                        <div class="form-group">
                                                                            <label>Upload file</label>
                                                                            <input type="file" class="form-control" name="file4"/>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-xs-3">
                                                                        <div class="form-group">
                                                                            <label>Upload file</label>
                                                                            <input type="file" class="form-control" name="file2"/>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-xs-3">
                                                                        <div class="form-group">
                                                                            <label>Upload file</label>
                                                                            <input type="file" class="form-control" name="file3"/>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-xs-12">
                                                                    <input name="id" type="hidden" value="<?php echo $id;?>" />
                                                                    <input name="shopID" type="hidden" value="<?php echo $row['shopID'];?>" />
                                                                    <button class="btn btn-primary" type="submit" name="login">Send Message</button>
                                                                </div>
                                                            </div>
                                                        </form>

                                                    </div>

                                                </div>






                                            </div>
                                        </div>
                                    </div>
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
