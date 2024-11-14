<?php
header('Content-Type: application/json');
include 'db_connection.php';

$sql = "DELETE FROM analysis_results";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "All posts deleted successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error deleting posts."]);
}

$conn->close();
?>
