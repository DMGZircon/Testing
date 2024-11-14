<?php
header('Content-Type: application/json');
include 'db_connection.php';

// Fetch top 5 posts by highest overall score
$sql = "SELECT * FROM analysis_results ORDER BY overallScore DESC LIMIT 5";
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
