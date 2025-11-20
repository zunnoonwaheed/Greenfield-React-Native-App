<?php require_once("includes/db_settings.php"); ?>
<?php
$p=$_GET["p"];
$sql1   = "select * from sizee WHERE catID=$p ORDER by name";
$resulti  = mysqli_query($con,$sql1);
?>
<select name="catID" class="form-control">
<option  value="<?php echo $p;?>"><?php if ($p==2){ echo "Main-Category"; }?></option>
<?php
for ($i=0; $i < mysqli_num_rows ($resulti); $i++){
mysqli_data_seek($resulti, $i);
$query_data2=mysqli_fetch_array($resulti);
?>
<option value="<?php echo $query_data2['id'];?>"><?php echo $query_data2['name'];?></option>
<?php
}
?>     
</select>