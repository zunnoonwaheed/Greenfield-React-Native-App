<?php include('head.php');
$controls=new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage '.$row['name']);
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Brand</a></li>
                                <li class=""><a data-toggle="tab" href="#tab-2">   Meta Tags</a></li>
                            </ul>
                            <form action="brandInserted.php" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">
                                           

                                            <div class="form-group"><label class="col-sm-2 control-label">Brand Name</label>
                                                <div class="col-sm-10">
                                                    <input name="name" type="text" id="name" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Brand Slug</label>
                                                <div class="col-sm-10">
                                                    <input name="slug" type="text" id="slug" 
                                                        class="form-control"></div>
                                            </div>
                                            <div class="form-group">
    <label class="col-sm-2 control-label">Category</label>
    <div class="col-sm-10">
        <select name="mainID" id="mainID" class="form-control">
            <option value="">-- Select Category --</option>
            <?php
            $catQ = "SELECT id, name FROM sizee ORDER BY name ASC";
            $catRes = mysqli_query($con, $catQ);
            while($cat = mysqli_fetch_assoc($catRes)){
                echo "<option value='{$cat['id']}'>".htmlspecialchars($cat['name'])."</option>";
            }
            ?>
        </select>
    </div>
</div>
                                        </fieldset>

                                    </div>
                                </div>
                                <div id="tab-2" class="tab-pane">
                                    <div class="panel-body">

                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Brand Title</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="title" id="title" class="form-control"></div>
                                            </div>
                                       
 
                                            <div class="form-group"><label class="col-sm-2 control-label">Meta Description</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="descr" class="form-control"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Additional Headers</label>
                                                <div class="col-sm-10">
                                                    <textarea name="addhead"
                                                        class="form-control" id="addhead">
                                                    </textarea>
                                                </div>
                                            </div>
                                        </fieldset>


                                    </div>
                                </div>


                            </div>
                        </div>

                        <input name="Submit2" type="submit" class="btn btn-block btn-outline btn-success" value="Add Brand" /></form>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


<?php include('script.php'); ?>  
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
<script src="../admin/jquery.slugify.js" type="text/javascript"></script>
<script type="text/javascript" charset="utf-8">
    $().ready(function () {
        $('#slug').slugify('#name');

        var pigLatin = function(str) {
            return str.replace(/(\w*)([aeiou]\w*)/g, "$2$1ay");
        }

        $('#pig_latin').slugify('#title', {
            slugFunc: function(str, originalFunc) { return pigLatin(originalFunc(str)); } 
            }
        );

    }); 
</script>
 
</body>
</html>
