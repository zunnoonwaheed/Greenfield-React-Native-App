<?php
include('includes/db_settings.php');
date_default_timezone_set('Asia/Karachi');

// ===== Helper function for category dropdown =====
function getCategoryOptions($con, $selectedId){
    $options = "";
    $cats = mysqli_query($con, "SELECT id, name FROM sizee ORDER BY name ASC");
    while($c = mysqli_fetch_assoc($cats)){
        $sel = ($c['id'] == $selectedId) ? "selected" : "";
        $options .= "<option value='{$c['id']}' {$sel}>".htmlspecialchars($c['name'])."</option>";
    }
    return $options;
}

$draw = intval($_POST['draw']);
$start = intval($_POST['start']);
$length = intval($_POST['length']);
$searchValue = $_POST['search']['value'];

$where = "";
if(!empty($searchValue)){
    $searchValue = mysqli_real_escape_string($con, $searchValue);
    $where = "WHERE (dow.namee LIKE '%$searchValue%' 
              OR dow.author_name LIKE '%$searchValue%' 
              OR dow.author_id LIKE '%$searchValue%')";
}

$totalRecordsQuery = mysqli_query($con, "SELECT COUNT(*) AS total FROM dow");
$totalRecords = mysqli_fetch_assoc($totalRecordsQuery)['total'];

$filteredRecordsQuery = mysqli_query($con, "SELECT COUNT(*) AS total FROM dow $where");
$filteredRecords = mysqli_fetch_assoc($filteredRecordsQuery)['total'];

$query = "SELECT dow.*, sizee.name as categoryName
          FROM dow 
          LEFT JOIN sizee ON sizee.id = dow.catID
          $where 
          ORDER BY dow.id DESC 
          LIMIT $start, $length";
$result = mysqli_query($con, $query);

$data = [];
$s = $start + 1;

while($row = mysqli_fetch_assoc($result)){

    // ===== Status clickable label =====
    switch ($row['statuss']) {
        case 0:
            $statusText = "Pending";
            $labelClass = "label-warning";
            $newStatus = 1; // Move to Approved
            break;

        case 1:
            $statusText = "Approved";
            $labelClass = "label-primary";
            $newStatus = 0; // Move back to Pending
            break;

        case 2:
            $statusText = "Scheduled";
            $labelClass = "label-info";
            $newStatus = 1; // Move to Approved if needed
            break;

        default:
            $statusText = "Unknown";
            $labelClass = "label-default";
            $newStatus = 0;
    }

    $statusLabel = "
        <a href='update_status.php?id={$row['id']}&status={$newStatus}' 
           onclick=\"return confirm('Are you sure you want to change the status?');\">
            <span class='label {$labelClass}'>{$statusText}</span>
        </a>
    ";

    // ===== Schedule date fallback =====
 

    $data[] = [
        "sno" => $s++,
        "datee" => $row['datee'],
        "namee" => $row['namee'],

 
        "category" => "
            <select class='form-control category-select' data-id='{$row['id']}' style='width:150px;'>
                " . getCategoryOptions($con, $row['catID']) . "
            </select>
        ",

 
        "status" => $statusLabel,

        "option" => "
            <a class='btn btn-primary btn-circle' href='editdow.php?id={$row['id']}&catID={$row['catID']}&mainID={$row['mainID']}&imgName={$row['imagee']}'><i class='fa fa-edit'></i></a>
            <a class='btn btn-danger btn-circle' href='deldow.php?id={$row['id']}' onclick=\"return confirm('ALERT! \\nAre you sure you want to delete this Text Page')\"><i class='fa fa-times'></i></a>
            <a class='btn btn-warning btn-circle' target='_blank' href='../{$row['slug']}/'><i class='fa fa-eye'></i></a>
        "
    ];
}

$response = [
    "draw" => $draw,
    "recordsTotal" => $totalRecords,
    "recordsFiltered" => $filteredRecords,
    "data" => $data
];

echo json_encode($response);
