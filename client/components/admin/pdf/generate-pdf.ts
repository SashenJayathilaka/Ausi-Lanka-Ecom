import { Order } from "./OrderReceiptPDF";

// Server-side PDF generation without JSX
export async function generateOrderPDF(order: Order) {
  // We'll use a different approach since we can't use React PDF in server components
  // Let's create a HTML template and convert it to PDF
  const htmlContent = generateHTMLContent(order);

  // For now, we'll return a simple approach
  // You might want to use a library like puppeteer for HTML to PDF conversion
  // or stick with @react-pdf/renderer but handle it differently
  return htmlContent;
}

function generateHTMLContent(order: Order): string {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const LkrFormat = (amount: number): string => {
    return `LKR ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .order-id { font-size: 12px; color: #718096; margin-bottom: 3px; }
            .section { margin-bottom: 15px; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 8px; text-decoration: underline; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f7fafc; }
            .item-name { flex: 2; font-size: 10px; }
            .item-quantity { flex: 1; text-align: center; font-size: 10px; }
            .item-price { flex: 1; text-align: right; font-size: 10px; }
            .total-row { display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-weight: bold; font-size: 14px; }
            .address { font-size: 10px; line-height: 1.5; }
            .grid { display: flex; flex-wrap: wrap; margin-bottom: 10px; }
            .grid-item { width: 50%; margin-bottom: 8px; }
            .status-badge { background-color: #FEF3C7; color: #92400E; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div class="title">Order Receipt</div>
                    <div class="order-id">Order #: ${order.id}</div>
                    <div class="order-id">Date: ${formatDate(order.createdAt.toISOString())}</div>
                </div>
                <div class="status-badge">${order.status.toUpperCase()}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="grid">
                <div class="grid-item">
                    <div style="font-size: 10px; font-weight: bold;">Name</div>
                    <div style="font-size: 10px;">${order.name}</div>
                </div>
                <div class="grid-item">
                    <div style="font-size: 10px; font-weight: bold;">Mobile</div>
                    <div style="font-size: 10px;">${order.mobile}</div>
                </div>
                <div class="grid-item">
                    <div style="font-size: 10px; font-weight: bold;">Email</div>
                    <div style="font-size: 10px;">${order.user?.emailId || "N/A"}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Shipping Information</div>
            <div style="margin-bottom: 10px;">
                <div style="font-size: 10px; font-weight: bold;">Address</div>
                <div class="address">
                    ${order.addressLine1}
                    ${order.addressLine2 ? `, ${order.addressLine2}` : ""}
                    <br>${order.city}, ${order.postalCode}
                    <br>${order.district}
                </div>
            </div>
            <div class="grid">
                <div class="grid-item">
                    <div style="font-size: 10px; font-weight: bold;">Delivery Method</div>
                    <div style="font-size: 10px; text-transform: capitalize;">${order.deliveryMethod}</div>
                </div>
                <div class="grid-item">
                    <div style="font-size: 10px; font-weight: bold;">Comments</div>
                    <div style="font-size: 10px;">${order.comments || "No comments provided"}</div>
                </div>
                <div class="grid-item">
                    <div style="font-size: 10px; font-weight: bold;">Missing Items</div>
                    <div style="font-size: 10px;">${order.missingItems || "No missing items"}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Order Items (${order.items.length})</div>
            <div class="row" style="margin-bottom: 10px;">
                <div style="flex: 2; font-weight: bold; font-size: 10px;">Item</div>
                <div style="flex: 1; font-weight: bold; font-size: 10px; text-align: center;">Qty</div>
                <div style="flex: 1; font-weight: bold; font-size: 10px; text-align: right;">Price (LKR)</div>
            </div>
            
            ${order.items
              .map(
                (item) => `
                <div class="item-row">
                    <div style="flex: 2;">
                        <div class="item-name">${item.name}</div>
                        <div style="font-size: 9px; color: #666; margin-top: 2px;">Retailer: ${item.retailer}</div>
                        <div style="font-size: 9px; color: #666;">AUD: $${item.price}</div>
                    </div>
                    <div class="item-quantity">${item.quantity}</div>
                    <div class="item-price">${LkrFormat(Number(item.calculatedPrice))}</div>
                </div>
            `
              )
              .join("")}
        </div>

        <div class="section">
            <div class="section-title">Order Summary</div>
            <div class="total-row">
                <div>Total Amount:</div>
                <div>${LkrFormat(Number(order.totalAmount))}</div>
            </div>
        </div>

        <div class="section" style="margin-top: auto;">
            <div style="font-size: 8px; color: #718096; text-align: center;">
                Thank you for your purchase! If you have any questions, please contact our support team.
            </div>
        </div>
    </body>
    </html>
  `;
}
