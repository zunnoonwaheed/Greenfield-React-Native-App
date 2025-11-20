<?php include('head.php');
$controls=new htmlControl;
$id=$_REQUEST['id'];
$query = "select * from dow where id={$id}";
$result = mysqli_query($con,$query); 
$row = mysqli_fetch_array($result);
?>
<link href="css/plugins/summernote/summernote.css" rel="stylesheet">
<link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('edit post');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                    <form action="dowUpdated.php" method="post" enctype="multipart/form-data">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Post Detail</a></li>
                                <li class=""><a data-toggle="tab" href="#tab-2"> Title & Meta Tags</a></li>
                            </ul>
                            
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Name</label>
                                                <div class="col-sm-10">
                                                    <input name="namee" type="text" id="namee" class="form-control" value="<?php echo $row['namee']; ?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Page Slug</label>
                                                <div class="col-sm-10">
                                                    <input name="slug" type="text" id="slug_input" class="form-control" value="<?php echo $row['slug']; ?>"></div>
                                                     <input type="hidden" name="old_slug" value="<?= htmlspecialchars($row['slug']); ?>">
                                            </div>
                                        <!-- Image 1 -->
<div class="form-group">
    <label class="col-sm-2 control-label">Image</label>
    <div class="col-sm-10">
        <input name="file1" type="file" class="btn btn-primary" id="file1"/>

        <?php if (!empty($row['imagee'])): ?>
            <p style="margin-top:10px;">
                Current File: <strong><?= htmlspecialchars(basename($row['imagee'])) ?></strong>
            </p>
            <img src="../admin/upload/dow/<?= htmlspecialchars($row['imagee']) ?>" 
                 alt="Current Image 1" 
                 style="max-height:100px; margin-top:5px; border:1px solid #ccc; padding:3px;">
        <?php endif; ?>
    </div>
</div>

<!-- Image 2 -->
<div class="form-group">
    <label class="col-sm-2 control-label">Image 2</label>
    <div class="col-sm-10">
        <input name="file2" type="file" class="btn btn-primary" id="file2"/>

        <?php if (!empty($row['imagee2'])): ?>
            <p style="margin-top:10px;">
                Current File: <strong><?= htmlspecialchars(basename($row['imagee2'])) ?></strong>
            </p>
            <img src="../admin/upload/dow/<?= htmlspecialchars($row['imagee2']) ?>" 
                 alt="Current Image 2" 
                 style="max-height:100px; margin-top:5px; border:1px solid #ccc; padding:3px;">
        <?php endif; ?>
    </div>
</div>

<!-- Image 3 -->
<div class="form-group">
    <label class="col-sm-2 control-label">Image 3</label>
    <div class="col-sm-10">
        <input name="file3" type="file" class="btn btn-primary" id="file3"/>

        <?php if (!empty($row['imagee3'])): ?>
            <p style="margin-top:10px;">
                Current File: <strong><?= htmlspecialchars(basename($row['imagee3'])) ?></strong>
            </p>
            <img src="../admin/upload/dow/<?= htmlspecialchars($row['imagee3']) ?>" 
                 alt="Current Image 3" 
                 style="max-height:100px; margin-top:5px; border:1px solid #ccc; padding:3px;">
        <?php endif; ?>
    </div>
</div>

 <div class="form-group">
                                                <label class="col-sm-2 control-label">Price</label>
                                                <div class="col-sm-10">
                                                    <input name="price" type="text" id="price" class="form-control"  value="<?php echo $row['price']; ?>"/></div></div>
                                                    <div class="form-group">
                                                <label class="col-sm-2 control-label">Discounted Price</label>
                                                <div class="col-sm-10">
                                                    <input name="dprice" type="text" id="dprice" class="form-control"  value="<?php echo $row['dprice']; ?>"/></div></div>
                                                         <div class="form-group">
                                                <label class="col-sm-2 control-label">SKU</label>
                                                <div class="col-sm-10">
                                                    <input name="sku" type="text" id="sku" class="form-control"  value="<?php echo $row['sku']; ?>"/></div></div>
                                          <?php
$brand_query = "SELECT id, name FROM brands";
$brand_result = mysqli_query($con, $brand_query);
?>          
                                                 <div class="form-group">
    <label class="col-sm-2 control-label">Brand</label>
    <div class="col-sm-10">
        <select name="brID" id="brID" class="form-control">
            <option value="">Select Brand</option>
            <?php
            while ($brand = mysqli_fetch_assoc($brand_result)) {
                $selected = ($row['brID'] == $brand['id']) ? 'selected' : '';
                echo "<option value='{$brand['id']}' $selected>{$brand['name']}</option>";
            }
            ?>
        </select>
    </div>
</div>   
                                                    
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label">Excerpt</label>
                                                <div class="col-sm-10">
                                                    <input name="desc1" type="text" id="desc1" class="form-control"  value="<?php echo $row['desc1']; ?>"/></div></div>
           
   
                                            <div class="form-group"><label class="col-sm-2 control-label">Detail Description</label>
                                                <div class="col-sm-10">
                                                    
                                                        <textarea class="form-control" id="summernote" name="pageData"><?php echo $row['code']; ?></textarea>

                                                    
                                                </div>
                                            </div>
                                        </fieldset>

                                    </div>
                                </div>
                                <div id="tab-2" class="tab-pane">
                                    <div class="panel-body">

                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Page Title</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="title" id="title" class="form-control" value="<?php echo $row['title'];?>" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Alt Txt</label>
                                                <div class="col-sm-10">
                                                    <input type="text" class="form-control" name="keyword" id="keyword" value="<?php echo $row['keyword'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Meta Description</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="descr" class="form-control" value="<?php echo $row['descr'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Additional Headers</label>
                                                <div class="col-sm-10">
                                                    <textarea class="form-control" id="addhead" name="adhead"><?php echo $row['addhead'];?></textarea>
                                                </div>
                                            </div>
                                        </fieldset>


                                    </div>
                                </div>


                            </div>
                        </div>
                        <input type="hidden" name="id" id="id" value="<?php echo $id; ?>" /><input type="hidden" name="catID" id="catID" value="<?php echo $_GET['catID']; ?>" />
                        <input type="hidden" name="mainID" value="<?php echo $_GET['mainID'];?>" /><input type="hidden" name="imgName" value="<?php echo $_GET['imgName'];?>" /><input name="Submit2" type="submit" class="btn btn-block btn-outline btn-success" value="Update Post" /></form>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>
<?php include('script.php'); ?>  
<script src="js/plugins/summernote/summernote.min.js"></script>
<script type="text/javascript" charset="utf-8">
    
$(function() {
     $('#summernote').summernote({
      height: 300,
      onImageUpload: function(files, editor, $editable) {
      sendFile(files[0],editor,$editable);
      }  
	  

    });
	
    function sendFile(file,editor,welEditable) {
      data = new FormData();
      data.append("file", file);
       $.ajax({
       url: "summernote.php",
       data: data,
       cache: false,
       contentType: false,
       processData: false,
       type: 'POST',
       success: function(data){
       alert(data);
        editor.insertImage(welEditable, data);
    },
       error: function(jqXHR, textStatus, errorThrown) {
       console.log(textStatus+" "+errorThrown);
      }
    });
   }

  });		
			var postForm = function() {
	var content = $('textarea[name="pageData"]').html($('#summernote').code());
}
</script>  
</body>
</html>
