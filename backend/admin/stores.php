<?php include('head.php');
$controls=new htmlControl;
if(isset($_GET['deleteID'])){
	$imgName=$_GET['imgName'];
	$filename = "upload/stores/$imgName";
	if (file_exists($filename)) {
		unlink("upload/stores/$imgName");
	}
	$query = "DELETE FROM stores
			WHERE id=".$_GET['deleteID']."";
			
			if (!mysqli_query($con,$query))
			{
				die('Error: ' . mysqli_error($con));
			} 
}
//Insert Banner
if(isset($_POST['add'])){
	$query = "select * from stores order by sortID DESC";
	$result = mysqli_query($con,$query); 
	$rec_found = mysqli_fetch_array($result);
	$sortID= $rec_found['sortID'];
	$sortID++;
	$browse_file_name1 = $_FILES["file1"]["name"];
	$temp1 = $_FILES["file1"]["tmp_name"];
	$error1 = $_FILES["file1"]["error"];
	move_uploaded_file($temp1,"upload/stores/" . $browse_file_name1);
	$locat = str_replace("'","`",$_POST['locat']);
	
	$ins_query_img = "insert into 												
				stores(imagee, locat, linkk, sortID, websiteID)
				values('$browse_file_name1','$locat', '0','$sortID', '1')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}else{
					$_SESSION['alert']="Banner Added Successfully.";	
				}
}
	//Update Banner	
	if (isset($_POST['update'])) {

    $link = str_replace("'", "`", $_POST['link']);
    $locat = str_replace("'", "`", $_POST['locat']);
 
    $ins_query_img = "UPDATE stores SET linkk = '$link', locat = '$locat' WHERE id = " . $_GET['id'] . "";
    
    if (!mysqli_query($con, $ins_query_img)) {
        die('Error: ' . mysqli_error($con));
    }
else{
			$browse_file_name1 = $_FILES["file1"]["name"];
			if ($browse_file_name1!=""){
				$temp1 = $_FILES["file1"]["tmp_name"];
				$error1 = $_FILES["file1"]["error"];
				move_uploaded_file($temp1,"upload/stores/" . $browse_file_name1);
				
				$banner_update_query = "UPDATE stores SET imagee = '$browse_file_name1' WHERE id = ".$_GET['id']."";
				if (!mysqli_query($con,$banner_update_query)){
					die('Error: ' . mysqli_error($con));
				}
			}
			$_SESSION['alert']="Banner Updated Successfully.";
			}
		}

//Sorting Banners
if (isset($_GET['sortID'])){
	$sortID = $_GET['sortID'];
	$id = $_GET['id'];
	$sortID1 =  $_GET['sortID1'];
	$idb=$_GET['idb'];

	$query1 = "UPDATE stores 
	SET sortID='{$sortID1}'
	where id=$id";	
	if (!mysqli_query($con,$query1)){
		die('Error: ' . mysqli_error($con));
	}

	$query2 = "UPDATE stores 
	SET sortID='{$sortID}'
	where id=$idb";	
	if (!mysqli_query($con,$query2)){
		die('Error: ' . mysqli_error($con));
	}
}
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage slider banner');
            ?>
        
        <div class="wrapper wrapper-content animated fadeInRight">
<div class="p-w-md m-t-sm">

  <div class="ibox">
                   <div class="row">
                <div class="col-lg-12"><div class="ibox-content">
                <?php 
				if (isset($_GET['mode'])){
					$updateID=$_GET['id'];
					$query = "select * from stores where id=".$_GET['id']."";
					$result = mysqli_query($con,$query); 
					$row = mysqli_fetch_array($result);
					?>
                <form method="post" class="form-horizontal" enctype="multipart/form-data">
                                <div class="form-group"><label class="col-sm-2 control-label">Image</label>

                                    <div class="col-md-5"><input type="file" class="form-control" name="file1"></div>
                                <?php if (!empty($row['imagee'])): ?>
    <div class="mt-2">
        <img src="upload/stores/<?php echo $row['imagee'];?>" 
             alt="Current Image" style="max-height:80px; border:1px solid #ddd; padding:3px;">
    </div>
<?php endif; ?>
                                    <div class="col-md-2 hidden"><label>URL</label><input type="text" class="form-control" name="link" id="link" value="<?php echo $row['linkk'];?>"></div>
                                    <div class="col-md-2"><label>Location</label><input type="text" class="form-control" name="locat" id="locat" value="<?php echo $row['locat'];?>"></div>
                                </div>
                                
                                  
                              <input type="hidden" name="updateID" value="<?php echo $updateID;?>">
                                <div class="hr-line-dashed"></div>
                                <div class="form-group">
                                    <div class="col-sm-4 col-sm-offset-2">
                                        <button class="btn btn-white" type="submit">Cancel</button>
                                        <button class="btn btn-primary" type="submit" name="update">Save changes</button>
                                    </div>
                                </div>
                            </form>
                            <?php } else {?>   
                            <form method="post" class="form-horizontal"  enctype="multipart/form-data">               
								<div class="form-group"><label class="col-sm-2 control-label">Image</label>

                                    <div class="col-md-5"><input type="file" class="form-control" name="file1"></div>
                                    <div class="col-md-4"><input type="text" class="form-control" placeholder="Location" name="locat" id="locat"></div>
                                </div>
                                <div class="hr-line-dashed"></div>
                                <div class="form-group">
                                    <div class="col-sm-4 col-sm-offset-2">
                                        <button class="btn btn-white" type="submit">Cancel</button>
                                        <button class="btn btn-primary" type="submit" name="add">Save changes</button>
                                    </div>
                                </div>
                            </form>
                            <?php } ?>
                            <p>Location 1 = Slider, Location 2 = Middle Banner 1, Location 3 = Middle Banner 2, Location 4 = Middle Banner 3, Location 5 = CTA Banner </p>
</div></div>           </div></div> 
       
                    <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-content">

                            <table class="footable table table-stripped toggle-arrow-tiny" data-page-size="15">
                                <thead>
                                <tr>

                                    <th data-toggle="true">Image</th>
                                    
                                    <th data-hide="all">Sorting</th>
                                    <th data-hide="all">Location</th>
                                    <th class="text-right" data-sort-ignore="true">Action</th>

                                </tr>
                                </thead>
                                <tbody>
                                   <?php
$rowsPerPage = 1;
$limit_pages=50;
$page = (isset($_GET['page']) && preg_match("/\d/", $_GET['page']) ) ? $_GET['page'] : 0;
if(isset($_GET['page']))
{
    $page = mysqli_escape_string($_GET['page']);
}

if( $page == "") {
    $page = 1;
}
if($page == 0 || $page == 1) {
    $rec = 0;
	
}
else{
    $rec = ($page - 1) * $limit_pages ;
	
}
$sql = "SELECT * FROM stores order by sortID LIMIT $rec, $limit_pages";
$resultp  = mysqli_query($con,$sql);
$sql2 = "SELECT * FROM stores order by sortID";

$result  = mysqli_query($con,$sql2);
$res2 = mysqli_num_rows($result);

$numofpages = ceil($res2/$rowsPerPage);
$total_page=(ceil($res2/$limit_pages));

$total_page=(ceil($res2/$limit_pages));
?>
<?php
for ($j=0; $j < mysqli_num_rows ($resultp); $j++){
mysqli_data_seek($resultp, $j);
$row=mysqli_fetch_array($resultp);
?>

                                <tr>
                                    <td style="width=300px">
                                       <img style="width:250px;" src="upload/stores/<?php echo $row['imagee'];?>"/>
                                    </td>
                                     
                                    <td>
<?php 
$sortID3=$row['sortID'];
$query_d = "select * from stores where sortID < $sortID3 order by sortID DESC";
$result_d = mysqli_query($con,$query_d); 
$rec_found_d = mysqli_num_rows($result_d);
if($rec_found_d >0){
$row_d = mysqli_fetch_array($result_d);
?>
<a href="stores.php?sortID=<?php echo $row['sortID'];?>&id=<?php echo $row['id'];?>&sortID1=<?php echo $row_d['sortID'];?>&idb=<?php echo $row_d['id'];?>"><i class="fa fa-sort-up"></i></a>
<?php }
$query_d = "select * from stores where sortID > $sortID3 order by sortID";
$result_d = mysqli_query($con,$query_d); 
$rec_found_d = mysqli_num_rows($result_d);
if($rec_found_d >0){ 
$row_d = mysqli_fetch_array($result_d);?>

<a href="stores.php?sortID=<?php echo $row['sortID'];?>&id=<?php echo $row['id'];?>&sortID1=<?php echo $row_d['sortID'];?>&idb=<?php echo $row_d['id'];?>"><i class="fa fa-sort-down"></i></a>
<?php }?>
                                    </td>
                                    <td>
                                        <?php echo $row['locat'];?>
                                    </td>
                                    <td class="text-right">
                                        <div class="btn-group">
                                            
                                            <a class="btn btn-info" href="stores.php?id=<?php echo $row['id'];?>&mode=Update">Edit</a>
                                           <a class="btn btn-warning" href="stores.php?deleteID=<?php echo $row['id'];?>&imgName=<?php echo $row['imagee'];?>" onClick="return confirm('ALERT! \nAre you sure you want to delete this banner')" >Delete</a>
                                        </div>
                                    </td>
                                </tr>
                               <?php } ?>

                                </tbody>
                                <?php
                                if ($total_page > 1) {



     		  $range =$numofpages; 
            $range_min = ($range % 2 == 0) ? ($range / 2) - 1 : ($range - 1) / 2; 
            $range_max = ($range % 2 == 0) ? $range_min + 1 : $range_min; 
            $page_min = $page- $range_min; 
            $page_max = $page+ $range_max; 

            $page_min = ($page_min < 1) ? 1 : $page_min; 
            $page_max = ($page_max < ($page_min + $range - 1)) ? $page_min + $range - 1 : $page_max; 
            if ($page_max > $total_page) { 
                $page_min = ($page_min > 1) ? $total_page - $range + 1 : 1; 
                $page_max = $total_page; 
            } 

            $page_min = ($page_min < 1) ? 1 : $page_min; 


          

             ?>
                                <tfoot>
                                <tr>
                                    <td colspan="6">
                                        <ul class="pagination pull-right">
                                        <?php
										if ($page != 1) {
                                         @$page_pagination .= '<li class="footable-page-arrow"><a data-page="prev" href="banner.php?page='.($page-1).'"><</a></li>'; 
										 }
			if ($total_page>16){
			$ppp=$total_page-21;
			if (($_GET['page']>=16)&&($_GET['page']<=$ppp)){
				$page_min=$page-10;
				$page_max=$page+10;
			}
			if ($_GET['page']>$ppp){
				
				$page_max=$total_page; 
				$page_min=$page_max-25;
			}
			
			if ($_GET['page']<16){
				$page_max=23;
			}
			if ($page_min<1){
				$page_min=1;
			}
			}
            for ($i = $page_min;$i <= $page_max;$i++) {
			if ($i == $page) 
                @$page_pagination .= '<li class="footable-page active"><a data-page="0" href="#">'.$i.'</a></li>'; 
                else 
							
                $page_pagination.= '<li class="footable-page"><a data-page="1" href="banner.php?page='.$i.'">'.$i.'</a></li>'; 
			}

            if ($page < $total_page) { 
			
 @$page_pagination .= '<li class="footable-page-arrow"><a data-page="next" href="banner.php?page='.($page+1).'">›</a></li> '; 


            } 


           
echo $page_pagination;
			

			
										 ?>
                                        
                                        </ul>
                                    </td>
                                </tr>
                                </tfoot>
                                <?php }  ?>
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
<!-- Page-Level Scripts -->
<script>
    $(document).ready(function(){
        $('.dataTables-example').DataTable({
            dom: '<"html5buttons"B>lTfgitp',

            customize: function (win){
                $(win.document.body).addClass('white-bg');
                $(win.document.body).css('font-size', '10px');

                $(win.document.body).find('table')
                .addClass('compact')
                .css('font-size', 'inherit');
            }
            }
            ]

        });

        /* Init DataTables */
        var oTable = $('#editable').DataTable();

        /* Apply the jEditable handlers to the table */
        oTable.$('td').editable( 'http://webapplayers.com/example_ajax.php', {
            "callback": function( sValue, y ) {
                var aPos = oTable.fnGetPosition( this );
                oTable.fnUpdate( sValue, aPos[0], aPos[1] );
            },
            "submitdata": function ( value, settings ) {
                return {
                    "row_id": this.parentNode.getAttribute('id'),
                    "column": oTable.fnGetPosition( this )[2]
                };
            },

            "width": "90%",
            "height": "100%"
        } );


    });

    function fnClickAddRow() {
        $('#editable').dataTable().fnAddData( [
            "Custom row",
            "New row",
            "New row",
            "New row",
            "New row" ] );

    }
</script>

</body>


<!-- Mirrored from webapplayers.com/inspinia_admin-v2.5/table_data_tables.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 26 May 2016 13:15:49 GMT -->
</html>
