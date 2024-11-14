<?php
header('Content-Type: application/json');
include 'db_connection.php';

$id = $_GET['id'];

if (isset($id)) {
    $stmt = $conn->prepare("DELETE FROM analysis_results WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Post deleted successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Post not found."]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid ID."]);
}

$conn->close();
?>
