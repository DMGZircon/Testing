<?php
header('Content-Type: application/json');
include 'db_connection.php';

$sql = "SELECT * FROM analysis_results ORDER BY date DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$conn->close();
?>
