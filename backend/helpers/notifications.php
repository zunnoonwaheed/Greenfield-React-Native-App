<?php
/**
 * Notification Helper Functions
 * Create notifications for various user actions
 */

/**
 * Create a notification for a user
 * @param mysqli $con Database connection
 * @param int $user_id User ID
 * @param string $title Notification title
 * @param string $message Notification message
 * @param string $type Notification type (order, payment, address, promo, etc.)
 * @return bool Success status
 */
function createNotification($con, $user_id, $title, $message, $type = 'info') {
    $query = "INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
              VALUES (?, ?, ?, ?, 0, NOW())";

    $stmt = $con->prepare($query);
    if (!$stmt) {
        error_log("Failed to prepare notification query: " . $con->error);
        return false;
    }

    $stmt->bind_param('isss', $user_id, $title, $message, $type);
    $result = $stmt->execute();
    $stmt->close();

    if ($result) {
        error_log("✅ Notification created for user $user_id: $title");
    } else {
        error_log("❌ Failed to create notification: " . $con->error);
    }

    return $result;
}

/**
 * Create order notification
 * @param mysqli $con Database connection
 * @param int $user_id User ID
 * @param int $order_id Order ID
 * @param string $status Order status
 */
function createOrderNotification($con, $user_id, $order_id, $status = 'placed') {
    $titles = [
        'placed' => 'Order Placed Successfully!',
        'Current' => 'Order Confirmed',
        'Processed' => 'Order is Being Processed',
        'otw' => 'Your order is on its way!',
        'Delivered' => 'Order Delivered Successfully'
    ];

    $messages = [
        'placed' => "Your order #$order_id has been placed successfully. We'll notify you once it's confirmed.",
        'Current' => "Your order #$order_id is confirmed and will be processed soon.",
        'Processed' => "Your order #$order_id is being prepared for delivery.",
        'otw' => "Track your order #$order_id in real-time. Expected delivery soon!",
        'Delivered' => "Your order #$order_id has been delivered. Enjoy your purchase!"
    ];

    $title = $titles[$status] ?? 'Order Update';
    $message = $messages[$status] ?? "Your order #$order_id status: $status";

    return createNotification($con, $user_id, $title, $message, 'order');
}

/**
 * Create payment method notification
 * @param mysqli $con Database connection
 * @param int $user_id User ID
 * @param string $card_brand Card brand (visa, mastercard, amex)
 * @param string $last4 Last 4 digits
 */
function createPaymentMethodNotification($con, $user_id, $card_brand, $last4) {
    $title = 'New Payment Method Added';
    $message = "Your " . ucfirst($card_brand) . " card ending in •••$last4 has been added successfully.";

    return createNotification($con, $user_id, $title, $message, 'payment');
}

/**
 * Create address notification
 * @param mysqli $con Database connection
 * @param int $user_id User ID
 * @param string $label Address label (Home, Office, etc.)
 * @param string $address Address text
 */
function createAddressNotification($con, $user_id, $label, $address) {
    $title = 'New Address Added';
    $message = "Your $label address has been saved: $address";

    return createNotification($con, $user_id, $title, $message, 'address');
}

/**
 * Create profile update notification
 * @param mysqli $con Database connection
 * @param int $user_id User ID
 * @param string $field Field updated (name, email, phone, password)
 */
function createProfileUpdateNotification($con, $user_id, $field) {
    $titles = [
        'name' => 'Profile Updated',
        'email' => 'Email Updated',
        'phone' => 'Phone Number Updated',
        'password' => 'Password Changed Successfully'
    ];

    $messages = [
        'name' => 'Your profile name has been updated successfully.',
        'email' => 'Your email address has been updated successfully.',
        'phone' => 'Your phone number has been updated successfully.',
        'password' => 'Your password was changed successfully. If this wasn\'t you, contact support immediately.'
    ];

    $title = $titles[$field] ?? 'Profile Updated';
    $message = $messages[$field] ?? 'Your profile has been updated successfully.';

    return createNotification($con, $user_id, $title, $message, 'account');
}
