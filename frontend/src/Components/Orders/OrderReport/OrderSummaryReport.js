import React from 'react';
import './OrderSummaryReport.css';

class OrderSummaryReport extends React.Component {
    render() {
        const { order } = this.props;

        return (
            <div id="rorder-summary-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h2 id="rorder-summary-title" style={{ textAlign: 'center' }}>National Seminary Farm</h2>
                <p id="rorder-summary-address" style={{ textAlign: 'center' }}>7MH6+G6X, Meekanuwa Rd, Kandy</p>
                <p id="rorder-summary-contact-number" style={{ textAlign: 'center' }}>0112 976 121</p>
                <p id="rorder-summary-website" style={{ textAlign: 'center' }}>www.nsf.lk</p>
                <p id="rorder-summary-date" style={{ textAlign: 'right' }}>Date: {new Date().toLocaleDateString()}</p>

                <p id="rorder-summary-supplier">Supplier: {order.supplier}</p>

                <h3 id="rorder-summary-subject">Subject: Order Request for {order.orderType}</h3>

                <p id="rorder-summary-intro">Please find below the details of the order we would like to place with your company.</p>

                <h4 id="rorder-summary-details-title">Order Details:</h4>
                <p id="rorder-summary-order-id"><strong>Order ID:</strong> {order.orderID}</p>
                <p id="rorder-summary-order-date"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p id="rorder-summary-order-type"><strong>Order Type:</strong> {order.orderType}</p>

                <h4 id="rorder-summary-items-title">Items Ordered:</h4>
                <table id="rorder-summary-items-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead id="rorder-summary-items-header">
                        <tr>
                            <th id="rorder-summary-item-name-header" style={{ border: '1px solid black', padding: '8px' }}>Item Name</th>
                            <th id="rorder-summary-quantity-header" style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
                            <th id="rorder-summary-unit-header" style={{ border: '1px solid black', padding: '8px' }}>Unit</th>
                        </tr>
                    </thead>
                    <tbody id="rorder-summary-items-body">
                        {order.items.map((item, index) => (
                            <tr key={index} id={`rorder-summary-item-row-${index}`}>
                                <td id={`rorder-summary-item-name-${index}`} style={{ border: '1px solid black', padding: '8px' }}>{item.orderItem}</td>
                                <td id={`rorder-summary-quantity-${index}`} style={{ border: '1px solid black', padding: '8px' }}>{item.quantity}</td>
                                <td id={`rorder-summary-unit-${index}`} style={{ border: '1px solid black', padding: '8px' }}>{item.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h4 id="rorder-summary-description-title">Description:</h4>
                <p id="rorder-summary-description">{order.description}</p>

                <h4 id="rorder-summary-delivery-title">Delivery Instructions:</h4>
                <p id="rorder-summary-delivery-intro">Please deliver the items to the following address:</p>
                <p id="rorder-summary-delivery-address">National Seminary Farm, 7MH6+G6X, Meekanuwa Rd, Kandy</p>

                <h4 id="rorder-summary-payment-title">Payment Terms:</h4>
                <p id="rorder-summary-payment">Payment upon delivery</p>

                <h4 id="rorder-summary-contact-title">Contact Information:</h4>
                <p id="rorder-summary-contact-info">Should you have any questions regarding this order, please feel free to contact us at 0112 976 121.</p>

                <p id="rorder-summary-thank-you">Thank you for your prompt attention to this order.</p>

                <p id="rorder-summary-signature">Sincerely,</p>
                <p id="rorder-summary-name">Thushan Munasinghe</p>
                <p id="rorder-summary-position">Farm Owner</p>
                <p id="rorder-summary-farm-name">National Seminary Farm, Kandy</p>
            </div>
        );
    }
}

export default OrderSummaryReport;
