import React from 'react';

class OrderSummaryReport extends React.Component {
    render() {
        const { order} = this.props;

        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h2 style={{ textAlign: 'center' }}>National Seminary Farm</h2>
                <p style={{ textAlign: 'center' }}>7MH6+G6X, Meekanuwa Rd, Kandy</p>
                <p style={{ textAlign: 'center' }}>0112 976 121</p>
                <p style={{ textAlign: 'center' }}>www.nsf.lk</p>
                <p style={{ textAlign: 'right' }}>Date: {new Date().toLocaleDateString()}</p>

                
                <p>Supplier: {order.supplier}</p>

                <h3>Subject: Order Request for {order.orderType}</h3>

                

                <p>Please find below the details of the order we would like to place with your company.</p>

                <h4>Order Details:</h4>
                <p><strong>Order ID:</strong> {order.orderID}</p>
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Order Type:</strong> {order.orderType}</p>

                <h4>Items Ordered:</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Item Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{item.orderItem}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{item.quantity}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{item.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h4>Description:</h4>
                <p>{order.description}</p>

                <h4>Delivery Instructions:</h4>
                <p>Please deliver the items to the following address:</p>
                <p>National Seminary Farm, 7MH6+G6X, Meekanuwa Rd, Kandy</p>

                <h4>Payment Terms:</h4>
                <p>Payment upon delivery</p>

                <h4>Contact Information:</h4>
                <p>Should you have any questions regarding this order, please feel free to contact us at 0112 976 121.</p>

                <p>Thank you for your prompt attention to this order.</p>

                <p>Sincerely,</p>
                <p>Thushan Munasinghe</p>
                <p>Farm Owner</p>
                <p>National Seminary Farm, Kandy</p>
            </div>
        );
    }
}

export default OrderSummaryReport;
