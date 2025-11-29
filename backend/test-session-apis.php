<?php
/**
 * Test Session-Based APIs
 * Tests payment-methods, order-history, and notifications APIs with user 1015 session
 */

// Start session for user 1015
require_once __DIR__ . '/helpers/session_config.php';

// Set session as user 1015 (simulating logged in user)
$_SESSION['user_id'] = 1015;
$_SESSION['user_name'] = 'Zunnoon Waheed';
$_SESSION['user_email'] = 'maan@gmail.com';

$session_id = session_id();
echo "Session ID: $session_id\n";
echo "User ID in session: " . $_SESSION['user_id'] . "\n\n";

// Close session to allow APIs to access it
session_write_close();

// Test API endpoints
$base_url = 'http://localhost:8000';
$endpoints = [
    'payment-methods' => '/api/payment-methods.php',
    'order-history' => '/api/order-history.php',
    'notifications' => '/api/notifications.php?limit=5'
];

foreach ($endpoints as $name => $endpoint) {
    echo "=== Testing $name API ===\n";

    $ch = curl_init($base_url . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Cookie: PHPSESSID=$session_id",
        "X-Session-ID: $session_id"
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "HTTP Code: $http_code\n";

    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "Success: " . ($data['success'] ? 'YES' : 'NO') . "\n";

        if ($name === 'payment-methods' && isset($data['data']['payment_methods'])) {
            echo "Payment methods count: " . count($data['data']['payment_methods']) . "\n";
            foreach ($data['data']['payment_methods'] as $method) {
                echo "  - {$method['card_brand']} •••{$method['card_last4']}\n";
            }
        } elseif ($name === 'order-history' && isset($data['data']['orders'])) {
            echo "Orders count: " . count($data['data']['orders']) . "\n";
            foreach ($data['data']['orders'] as $order) {
                echo "  - Order #{$order['id']}: Rs. {$order['total']} ({$order['status']})\n";
            }
        } elseif ($name === 'notifications' && isset($data['data']['notifications'])) {
            echo "Notifications count: " . count($data['data']['notifications']) . "\n";
            echo "Unread count: " . ($data['data']['unread_count'] ?? 0) . "\n";
            foreach (array_slice($data['data']['notifications'], 0, 3) as $notif) {
                echo "  - {$notif['title']} (" . ($notif['read'] ? 'read' : 'unread') . ")\n";
            }
        }
    } else {
        echo "Response: $response\n";
    }

    echo "\n";
}

echo "✅ Test complete!\n";
