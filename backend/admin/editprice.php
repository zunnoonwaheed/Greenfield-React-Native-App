<?php include('head.php');
error_reporting(0);
$controls=new htmlControl;
$id=$_REQUEST['id'];
		$query = "select * from cart where id={$id}";
		//echo $query;
		
				$result = mysqli_query($con,$query); 
								$row = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('order detail');
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
                      <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <tbody>
                                            <form action="priceupdate.php" method="post" name="form1" id="form1">
                                                 <tr>
                                                <th>Email</th>
                                                <td>
                                                   <input id="email" name="email" value="<?php echo $row['email']; ?>" class="form-control"/>
                                                </td>
                                                </tr>
                                                <tr>
                                                <th>Words / Page</th>
                                                <td>
                                                  <select name="farmaish" id="farmaish"  class="form-control">
								 
      <option selected value="<?php echo $row['farmaish']; ?>"><?php echo $row['farmaish']; ?></option>

<option value="pages">Pages</option><option value="words">Words</option>
    </select>
                                                </td>
                                                </tr>
                                                 <tr>
                                                <th>Number of Words / Pages</th>
                                                <td>
                                                <input name="page_words" type="text" class="form-control" id="page_words" size="40" value="<?php echo $row['page_words']; ?>" />
                                                </td>
                                                </tr>
                                                <tr>
                                                <th>Your Topic</th>
                                                <td>
                                                   <textarea name="your_topic" cols="45" rows="2" class="form-control"  id="your_topic"><?php echo $row['your_topic']; ?></textarea>
                                                </td>
                                                </tr>
                                                  <tr>
                                                <th>Detail Instructions</th>
                                                <td>
                                                  <textarea name="detail_instructions" cols="45" rows="4" class="form-control"  id="detail_instructions"><?php echo $row['detail_instructions']; ?></textarea>
                                                </td>
                                                </tr>
                                                 <tr>
                                                <th>Type of Writing Service</th>
                                                <td>
                                                  <select name="writing_service" id="writing_service"  class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['writing_service']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID ='40' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
<?php } ?>
    </select>
                                                </td>
                                                </tr>
                                                  <tr>
                                                <th>Type of Help Require</th>
                                                <td>
                                                   <select name="help_require" id="help_require"  class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['help_require']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID =".$row['writing_service']." order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
<?php } ?>
    </select>
                                                </td>
                                                </tr>
 <tr>
                                                <th>Line Spacing</th>
                                                <td>
                                                  <select name="line_space" id="line_space"  class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['line_space']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID ='45' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
<?php } ?>
    </select>
                                                </td>
                                                </tr>  
                                                 <tr>
                                                <th>Software Service</th>
                                                <td>
                                                <select name="soft_service" id="soft_service"  class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['soft_service']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID ='42' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
<?php } ?>
    </select>
                                                </td>
                                                </tr>
                                                   <tr>
                                                <th>Topic Category</th>
                                                <td>
                                                <select name="topic" id="topic"  class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['topic']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID ='41' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
<?php } ?>
    </select>
                                                </td>
                                                </tr>
                                                 <tr>
                                                <th># of Presentation Slides</th>
                                                <td>
                                               <select name="pre_slide" id="pre_slide"  class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['pre_slide']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>
 <option value="0">0</option>
      <?php
$query_c = "select * from products where catID ='47' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
<?php } ?>
    </select>
                                                </td>
                                                </tr>
                                                
                                                 <tr>
                                                <th># of sources Refrences</th>
                                                <td>
                                                   <input name="sources_ref" type="text" class="form-control" id="price" size="40" value="<?php echo $row['sources_ref']; ?>" />
                                                </td>
                                                </tr>
                                                 <tr>
                                                <th>Writing Style Of Citations</th>
                                                <td>
                                   <select name="writing_style" id="writing_style"  class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['writing_style']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID ='43' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
<?php } ?>
    </select>
                                                </td>
                                                </tr>
                                                 <tr>
                                                <th>Preferred Language Level</th>
                                                <td>
                                                 <select name="language_style" id="language_style" class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['language_style']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID ='44' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
   <?php } ?>

    </select>
                                                </td>
                                                </tr>
                                                   <tr>
                                                <th>Education Level</th>
                                                <td>
                                              <select name="edu_level" id="edu_level" class="form-control" >
								   <?php
     $query_d = "select * from products where id=".$row['edu_level']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID ='46' order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
   <?php } ?>

    </select>
                                                </td>
                                                </tr>
                                                   <tr>
                                                <th>Paper Standard</th>
                                                <td>
                   <select name="paper_stnd" id="edu_level" class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['paper_stnd']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID =".$row['edu_level']." order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
   <?php } ?>

    </select>
                                                </td>
                                                </tr>
                                                   <tr>
                                                <th>Deadline</th>
                                                <td>
                 <select name="deadline" id="edu_level" class="form-control">
								   <?php
     $query_d = "select * from products where id=".$row['deadline']."";
//echo $query;
$result_d = mysqli_query($con,$query_d); 
$row_d = mysqli_fetch_array($result_d);
?>
      <option selected value="<?php echo $row_d['id']; ?>"><?php echo $row_d['namee'];?></option>

      <?php
$query_c = "select * from products where catID =".$row['paper_stnd']." order by id ASC ";
$result_c = mysqli_query($con,$query_c); $rec_found_c = mysqli_num_rows($result_c);
while($row_c = mysqli_fetch_array($result_c)){;
	?>              
	 <option value="<?php echo $row_c['id']; ?>"><?php echo $row_c['namee'];?></option>
   <?php } ?>

    </select>
                                                </td>
                                                </tr>
                                            <tr>
                                                <th>Before Discount</th>
                                                <td>
                                                   <input name="price" type="text" class="form-control" id="price" size="40" value="<?php echo $row['price']; ?>" />
                                                </td>
                                                </tr>
                                                 <tr>
                                                <th>Discount Code</th>
                                                <td>
                                                   <input name="dCode" type="text" class="form-control" id="dCode" size="40" value="<?php echo $row['dCode']; ?>" />
                                                </td>
                                                </tr>
                                                 <tr>
                                                <th>Gross Amount</th>
                                                <td>
                                                  <input name="gamount" type="text" class="form-control" id="gamount" size="40" value="<?php echo $row['gamount']; ?>" />
                                                </td>
                                                </tr>
                                                <td colspan="5"><input type="hidden" name="id" id="id" value="<?php echo $id; ?>" /></td>
                                                 
<tr>
                                                <td colspan="5"><input name="Submit" type="submit" class="text7" id="Submit" value="Update" />
					            <input name="Reset" type="reset" class="text7" id="Reset" value="Reset" /></td>
			 </tr>
			
</body>
</html>