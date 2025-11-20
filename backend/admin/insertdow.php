<?php include('head.php');
$controls=new htmlControl;

?>
<link href="css/plugins/summernote/summernote.css" rel="stylesheet">
<link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('Add Product');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                 <form action="dowInserted.php" method="post" enctype="multipart/form-data">
                 <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Page Detail</a></li>
                                <li class=""><a data-toggle="tab" href="#tab-2"> Title & Meta Tags</a></li>
                            </ul>
                           
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Name</label>
                                                <div class="col-sm-10">
                                                    <input name="namee" type="text" id="namee" class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Slug</label>
                                                <div class="col-sm-10">
                                                    <input name="slug" type="text" id="slug_input" class="form-control slug" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Image</label>
                                                <div class="col-sm-10">
                                                    <input name="file1" type="file" class="btn btn-primary" id="file1"/></div>
                                            </div>
                                              <div class="form-group"><label class="col-sm-2 control-label">Image 2</label>
                                                <div class="col-sm-10">
                                                    <input name="file2" type="file" class="btn btn-primary" id="file2"/></div>
                                            </div>
                                              <div class="form-group"><label class="col-sm-2 control-label">Image 3 </label>
                                                <div class="col-sm-10">
                                                    <input name="file3" type="file" class="btn btn-primary" id="file3"/></div>
                                            </div>
    <div class="form-group">
                                                <label class="col-sm-2 control-label">Price</label>
                                                <div class="col-sm-10">
                                                    <input name="price" type="number" id="price" class="form-control" /></div></div>
                                                     <div class="form-group">
                                                <label class="col-sm-2 control-label">Discounted Price</label>
                                                <div class="col-sm-10">
                                                    <input name="dprice" type="number" id="dprice" class="form-control" /></div></div>
                                                      <div class="form-group">
                                                <label class="col-sm-2 control-label">SKU</label>
                                                <div class="col-sm-10">
                                                    <input name="sku" type="text" id="sku" class="form-control" /></div></div>
                                                    <?php
// Fetch brands from the database
$brand_query = "SELECT id, name FROM brands";
$brand_result = mysqli_query($con, $brand_query);
?>          

<div class="form-group">
    <label class="col-sm-2 control-label">Brand</label>
    <div class="col-sm-10">
        <select name="brID" id="brID" class="form-control select2">
            <option value="">Select Brand</option>
            <?php
            while ($brand = mysqli_fetch_assoc($brand_result)) {
                echo "<option value='{$brand['id']}'>{$brand['name']}</option>";
            }
            ?>
        </select>
    </div>
</div>


                                            <div class="form-group">
                                                <label class="col-sm-2 control-label">Excerpt</label>
                                                <div class="col-sm-10">
                                                    <input name="desc1" type="text" id="desc1" class="form-control" /></div></div>
                                                    

                                            <div class="form-group"><label class="col-sm-2 control-label">Detail Description</label>
                                                <div class="col-sm-10">
                                                <textarea class="form-control" id="summernote" name="pageData"></textarea>
                                                   
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
                                                    <input type="text" name="title" id="title" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Meta Keyword</label>
                                                <div class="col-sm-10"><input type="text" class="form-control" name="keyword" id="keyword"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Meta Description</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="descr" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Additional Headers</label>
                                                <div class="col-sm-10">
                                                    <textarea name="addhead" class="form-control" id="addhead" >

                                                    </textarea>
                                                </div>
                                            </div>
                                        </fieldset>


                                    </div>
                                </div>


                            </div>
                        </div>
                       
                        <input type="hidden" name="mainID" value="<?php echo $_GET['mainID'];?>" />
                        <input type="hidden" name="catID" value="<?php echo $_GET['catID'];?>" /><input name="Submit2" type="submit" class="btn btn-block btn-outline btn-success" value="Add product" />
                    </div>
                </div></form>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>
 
<?php include('script.php'); ?>  
<script src="js/plugins/summernote/summernote.min.js"></script>
<script src="jquery.slugify.js" type="text/javascript"></script>
		<script type="text/javascript" charset="utf-8">
			$().ready(function () {
				$('.slug').slugify('#namee');
			
				var pigLatin = function(str) {
					return str.replace(/(\w*)([aeiou]\w*)/g, "$2$1ay");
				}
			
				$('#pig_latin').slugify('#title', {
						slugFunc: function(str, originalFunc) { return pigLatin(originalFunc(str)); } 
					}
				);
			
			}); 
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
		<script>
$(document).ready(function() {
    $('#brID').select2({
        placeholder: "Select a brand",
        allowClear: true
    });
});
</script>
<!-- jQuery (required) -->
 
<!-- Select2 JS -->
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<!-- Select2 CSS -->


</body>
</html>
