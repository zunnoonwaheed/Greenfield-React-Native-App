<?php 
/*if(isset($_SESSION['writer_asign']) != 'manager')
{
    header("location: ../manager/login.php");
}
else if($_SESSION["writer_asign"]=='admin'){
    header("location: orders.php?statuss=Current");
}*/
/*else
{
    header("location: login.php");
}*/
include('head.php');
$controls=new htmlControl;
@$statuss=$_REQUEST['statuss'];?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection($statuss.' Order');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <button type="button" onclick="location.href='orders.php?statuss=Current';" class="btn btn-w-m btn-success">Current</button>
                                <button type="button" onclick="location.href='orders.php?statuss=Revision';" class="btn btn-w-m btn-info">Revision</button>
                                <button type="button" onclick="location.href='orders.php?statuss=Completed';" class="btn btn-w-m btn-primary">Completed</button>
                                <button type="button" onclick="location.href='orders.php?statuss=Cancel';" class="btn btn-w-m btn-danger">Cancel</button>
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
                                <?php 
                                $role=$_SESSION['role'];
                                if ($statuss !=""){
                                    if ($role=="admin"){
                                        $query = "select * from cart where statuss='$statuss' ORDER by id DESC";
                                    }else{
                                        $query = "select * from cart where statuss='$statuss' AND paidStatuss='paid' ORDER by id DESC";
                                    }
                                }else{
                                    $orderID=$_POST['orderID'];
                                    $query = "select * from cart where id=$orderID";
                                }
                                $result = mysqli_query($con,$query); 
                                $rec_found = mysqli_num_rows($result);
                                while($row = mysqli_fetch_array($result)){

                                    $query_cart_update = "UPDATE cart 
                                    SET importan='admin'
                                    where id=".$row['id']."";   
                                    //echo $query . "<br/>";
                                    //echo $query;                                                      
                                    if (!mysqli_query($con,$query_cart_update))
                                    {
                                        die('Error: ' . mysqli_error($con));
                                    }

                                    ?>
                                    <div class="table-responsive">
                                        <table class="table table-striped table-bordered table-hover dataTables-example">
                                            <thead
                                            <?php
                                            $ip_sql=mysqli_query("select orderID from urgent where orderID=".$row['id']."");
                                            $count=mysqli_num_rows($ip_sql);
                                            if($count!=0){
                                                echo "class='panel panel-success'";
                                            }echo '>';
                                            ?> 
                                            <tr>
                                                <th>Topic:<?php
                                                    $query_meta = "select * from products where id=".$row['topic']."";
                                                    //echo $query;
                                                    $result_meta = mysqli_query($con,$query_meta); 
                                                    $row_meta = mysqli_fetch_array($result_meta);
                                                    ?>
                                                    <?php echo $row_meta['namee'];?></td>
                                                    <?php
                                                    $query_meta = "select * from products where id=".$row['deadline']."";
                                                    //echo $query;
                                                    $result_meta = mysqli_query($con,$query_meta); 
                                                    $row_meta = mysqli_fetch_array($result_meta);
                                                ?></th>
                                                <th>
                                                    Deadline Date & Time: <?
                                                    $dd=substr($row_meta['namee'], 0, 2);
                                                    preg_match_all('#([A-Z]+)#',$row_meta['namee'],$matches);

                                                    $UC=implode($matches[1]);
                                                    $dh=substr($UC,0,1);
                                                    if($dh=="D"){
                                                        echo date('jS F, Y h:i:s',strtotime('+'.$dd.'days',strtotime($row['order_date'])));

                                                    }else{
                                                        echo date('jS F, Y h:i:s',strtotime('+'.$dd.'hour',strtotime($row['order_date'])));
                                                }?></th>
                                                <th>Order Date: <?php $newvalue = date('jS F, Y h:i:s', strtotime($row['order_date']));
                                                echo $newvalue;?></th>
                                            </tr>
                                            </thead>

                                            <tr class="gradeX">
                                                <td>Status<form action="status.php" method="POST">
                                                        <select name="statuss" class="form-control">
                                                            <option value="Current" <?php if ($row['statuss']=="Current"){?> selected="selected" <?php } ?>>New</option>
                                                            <option value="Revision" <?php if ($row['statuss']=="Revision"){?> selected="selected" <?php } ?>>Revision</option>
                                                            <option value="Completed" <?php if ($row['statuss']=="Completed"){?> selected="selected" <?php } ?>>Completed</option>
                                                            <option value="Cancel" <?php if ($row['statuss']=="Cancel"){?> selected="selected" <?php } ?>>Cancelled</option>
                                                        </select><input name="shopID" type="hidden" value="<?php echo $row['shopID']?>" /> <input name="Submit" type="submit" value="Submit" class="button button_middle button_arrow"/>
                                                    </form>
                                                </td>
                                                <td>Writers
                                                    <?php
                                                    if ($row['writerID']==""){                  
                                                        ?>
                                                        <form method="post" action="writerUpdate.php?id=<?php echo $row['id'];?>&statuss=<?php echo $_GET['statuss'];?>">
                                                            <select name="writerID" onchange="this.form.submit();" class="form-control">
                                                                <option selected="selected">Please Assign Writer</option>
                                                                <?php

                                                                $query_writer = "select * from members where writer_asign = 'writer' OR writer_asign = 'manager'  ORDER by namee";
                                                                $result_writer = mysqli_query($con,$query_writer); 
                                                                $rec_found_writer = mysqli_num_rows($result_writer);
                                                                while($row_writer = mysqli_fetch_array($result_writer)){
                                                                    ?>
                                                                    <option value="<?php echo $row_writer['id']?>"><?php echo $row_writer['namee'].' Username: '.$row_writer['username'];?></option>
                                                                    <?php } ?>
                                                            </select> 
                                                        </form>
                                                        <?php }else{ ?>
                                                        <?php
                                                        $query_writer = "select * from members where id= ".$row['writerID']."";
                                                        $result_writer = mysqli_query($con,$query_writer); 
                                                        $rec_found_writer = mysqli_num_rows($result_writer);
                                                        $row_writer = mysqli_fetch_array($result_writer);
                                                        echo $row_writer['namee'].' Username: '.$row_writer['username'] .'<br>'. 'Writer Status:'. $row['writerStatus'];
                                                        ?> - <?php  if ($row['writerID']!=""){?> <a href="editwriter.php?id=<?php echo $row['id'];?>&statuss=<?php echo $row['statuss'];?>">EDIT</a><?php }?>
                                                        <?php } ?> - 
                                                    <?php
                                                    $ip_sql=mysqli_query("select orderID from urgent where orderID=".$row['id']."");
                                                    $count=mysqli_num_rows($ip_sql);
                                                    if($count==0){
                                                        ?>
                                                        <a href="specialImageUpdated.php?orderID=<?php echo $row['id'];?>&action=add&statuss=<?php echo $_GET['statuss'];?>">Mark Important </a>
                                                        <?php }else{ ?>
                                                        <a href="specialImageUpdated.php?orderID=<?php echo $row['id'];?>&action=delete&statuss=<?php echo $_GET['statuss'];?>">UnMark Important </a>
                                                    <?php } ?></td>
                                                <?php 
                                                $r=mysqli_query("Select * From dashboard where role='writer' And pid='".$row['id']."' AND status=0 AND email <> 'admin'");
                                                $NumRow=mysqli_num_rows($r);
                                                ?>
                                                <?php
                                                $t=mysqli_query("Select * From dashboard where role='user' And pid='".$row['id']."' AND status=0 AND email <> 'admin'");
                                                $NumRows=mysqli_num_rows($t);?>
                                                <td>
                                                    <a href="details.php?id=<?php echo $row['id'];?>">Details</a> - <a href="dashboard.php?id=<?php echo $row['id'];?>">Conversation <span class="btn-primary">(Writer: <?php echo $NumRow?> | User: <?php echo $NumRows?>)</span></a> - <?php if ($row['paidStatuss']=="UnPaid"){?><a href="email.php?id=<?php echo $row['id'];?>&email=<?php echo $row['email'];?>&statuss=<?php echo $_GET['statuss'];?>">Send Email</a><?php } ?> 
                                                    <!--<form method="POST" action="delOrder.php?shopID=<?php //echo $row['shopID'];?>&statuss=<?php //echo $_GET['statuss']?>">
                                                    <input name="pin" type="text" placeholder="PIN" class="form-control"/><input type="submit" name="Delete Order" value="Delete Order" 
                                                    class="form-control" />
                                                    </form>-->
                                                </td>
                                            </tr>
                                            <tr><td>Paid Status <form action="status10.php" method="POST">
                                                        <select name="paidStatuss" class="form-control">
                                                            <option value="paid" <?php if ($row['paidStatuss']=="paid"){?> selected="selected" <?php } ?>>Paid</option>
                                                            <option value="UnPaid" <?php if ($row['paidStatuss']=="UnPaid"){?> selected="selected" <?php } ?>>UnPaid</option>

                                                        </select><input name="shopID" type="hidden" value="<?php echo $row['shopID']?>" /> <input name="Submit" type="submit" value="Submit" class="button button_middle button_arrow" />
                                                    </form></td>
                                                <td>
                                                    <?php
                                                    $qry ="Select * From profile where email2='".$row['email']."'";
                                                    $result1 = mysqli_query($con,$qry); 
                                                    $rec_found1 = mysqli_num_rows($result1);
                                                    $rec_found1 = mysqli_fetch_array($result1);
                                                    //print_r($rec_found1);
                                                    //die;
                                                    ?>     
                                                    Order By: &nbsp;(<? echo $rec_found1['namee'] ." ". $rec_found1['last_name']; ?>)&nbsp;&nbsp;<a href="detailClient.php?email=<?php echo $row['email'];?>"><?php echo $row['email'];?></a>
                                                </td>
                                                <td>OrderID: &nbsp; EW1 - <?php echo $row['id'];?></td>

                                            </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <hr class="btn-primary">
                                    <?php } ?>


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
