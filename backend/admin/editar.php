<?php include('head.php');
$controls=new htmlControl;
$id = $_REQUEST['id'];
$query = "select * from sizee where id={$id}";
$result = mysqli_query($con,$query); 
$row = mysqli_fetch_array($result);
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
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Edit <?php echo $row['name']; ?></a></li>
                                <li class=""><a data-toggle="tab" href="#tab-2"> Title & Meta Tags</a></li>
                            </ul>
                            <form action="arUpdated.php" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">
                                            
                                            

                                            <div class="form-group"><label class="col-sm-2 control-label">Name</label>
                                                <div class="col-sm-10">
                                                    <input name="name" type="text" id="name" class="form-control" value="<?php echo $row['name'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Page Slug</label>
                                                <div class="col-sm-10">
                                                    <input name="slug" type="text" id="slug_input" 
                                                        class="form-control" value="<?php echo $row['slug'];?>"></div>
                                            </div>
                                                <!-- ✅ New Image Upload Field -->
    <div class="form-group">
        <label class="col-sm-2 control-label">Image</label>
        <div class="col-sm-10">
            <?php if(!empty($row['image'])) { ?>
                <img src="upload/stores/<?php echo $row['image']; ?>" alt="Image" style="max-width:150px; margin-bottom:10px;">
            <?php } ?>
            <input type="file" name="image" class="form-control">
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
                                                    <input type="text" name="title" id="title" class="form-control" value="<?php echo $row['title'];?>"></div>
                                            </div>
                                          <div class="form-group">
    <label class="col-sm-2 control-label">Top Menu</label>
    <div class="col-sm-10">
        <select class="form-control" name="keyword" id="keyword">
            <option value="yes" <?php if($row['keyword'] == 'yes') echo 'selected'; ?>>Yes</option>
            <option value="no" <?php if($row['keyword'] == 'no') echo 'selected'; ?>>No</option>
        </select>
    </div>
</div>
 <div class="form-group">
    <label class="col-sm-2 control-label">Center Menu</label>
    <div class="col-sm-10">
        <select class="form-control" name="keyword1" id="keyword1">
            <option value="yes" <?php if($row['keyword1'] == 'yes') echo 'selected'; ?>>Yes</option>
            <option value="no" <?php if($row['keyword1'] == 'no') echo 'selected'; ?>>No</option>
        </select>
    </div>
</div>
 <div class="form-group">
    <label class="col-sm-2 control-label">Footer Menu</label>
    <div class="col-sm-10">
        <select class="form-control" name="keyword2" id="keyword2">
            <option value="yes" <?php if($row['keyword2'] == 'yes') echo 'selected'; ?>>Yes</option>
            <option value="no" <?php if($row['keyword2'] == 'no') echo 'selected'; ?>>No</option>
        </select>
    </div>
</div>
<div class="form-group">
    <label class="col-sm-2 control-label">Parent Category</label>
    <div class="col-sm-10">
        <select class="form-control" name="menuID" id="menuID">
            <option value="0" <?= ($row['menuID'] == 0 ? "selected" : "") ?>>
                -- Main Category --
            </option>
            <?php
            $parentsQ = "SELECT id, name FROM sizee ORDER BY name ASC";
            $parentsRes = mysqli_query($con, $parentsQ);
            while ($parent = mysqli_fetch_assoc($parentsRes)):
                $selected = ($row['menuID'] == $parent['id']) ? "selected" : "";
            ?>
                <option value="<?= $parent['id']; ?>" <?= $selected; ?>>
                    <?= htmlspecialchars($parent['name']); ?>
                </option>
            <?php endwhile; ?>
        </select>
    </div>
</div>
<div class="form-group">
    <label class="col-sm-2 control-label">Sort Order</label>
    <div class="col-sm-10">
        <input type="number" class="form-control" name="sort_order" 
               value="<?= isset($row['sort_order']) ? (int)$row['sort_order'] : 0; ?>" />
       
    </div>
</div>


                                            <div class="form-group"><label class="col-sm-2 control-label">Meta Description</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="descr" class="form-control" value="<?php echo $row['descr'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Additional Headers</label>
                                                <div class="col-sm-10">
                                                    <textarea name="addhead"
                                                        class="form-control" id="addhead">
                                                    <?php echo $row['addhead'];?></textarea>
                                                </div>
                                            </div>
                                        </fieldset>


                                    </div>
                                </div>


                            </div>
                        </div>
                        <input type="hidden" name="id" id="id" value="<?php echo $id; ?>" />
                        <input name="Submit2" type="submit" class="btn btn-block btn-outline btn-success" value="Update <?php echo $row['name']; ?>" /></form>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


<?php include('script.php'); ?>  
<script type="text/javascript">
    function showUser1(str1)
    {

        if (str1=="")
        {
            document.getElementById("txtHint1").innerHTML="";
            return;
        }
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                document.getElementById("txtHint1").innerHTML=xmlhttp.responseText;
            }
        }
        xmlhttp.open("GET","getuser1.php?p="+str1,true);
        xmlhttp.send();
    }
</script>
</script>  
</body>
</html>
