// components/OrderReceiptPDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface Order {
  items: {
    id: string;
    orderId: string;
    name: string;
    price: string;
    image: string;
    url: string | null;
    retailer: string;
    calculatedPrice: string;
    quantity: number;
    createdAt: Date;
  }[];
  user: {
    id: string;
    name: string;
    emailId: string;
    imageUrl: string | null;
  };
  id: string;
  userId: string;
  name: string;
  mobile: string;
  deliveryMethod: "sea" | "air" | "express";
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string;
  postalCode: string;
  comments: string | null;
  missingItems: string[] | null;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: string;
  createdAt: Date;
  updatedAt: Date;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 25,
    borderBottom: "1pt solid #e2e8f0",
    paddingBottom: 15,
  },
  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  businessName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a202c",
  },
  businessTagline: {
    fontSize: 10,
    color: "#718096",
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a202c",
  },
  orderId: {
    fontSize: 11,
    color: "#718096",
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2d3748",
    textDecoration: "underline",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: "1pt solid #f7fafc",
  },
  itemDetails: {
    flex: 2,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  itemMeta: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
    flexWrap: "wrap",
  },
  itemQuantity: {
    fontSize: 11,
    width: 60,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  itemPrice: {
    fontSize: 11,
    width: 80,
    textAlign: "right",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTop: "2pt solid #e2e8f0",
    fontWeight: "bold",
    fontSize: 16,
  },
  address: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  gridItem: {
    width: "50%",
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    padding: "6px 12px",
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#4a5568",
  },
  value: {
    fontSize: 11,
    color: "#2d3748",
    lineHeight: 1.4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "1pt solid #e2e8f0",
    backgroundColor: "#f8fafc",
    padding: 10,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2d3748",
  },
  footer: {
    marginTop: "auto",
    borderTop: "1pt solid #e2e8f0",
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: "#718096",
    textAlign: "center",
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 8,
    color: "#a0aec0",
    textAlign: "center",
  },
  contactInfo: {
    fontSize: 8,
    color: "#718096",
    textAlign: "center",
    marginBottom: 3,
  },
});

interface OrderReceiptPDFProps {
  order: Order;
}

export const OrderReceiptPDF: React.FC<OrderReceiptPDFProps> = ({ order }) => {
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

  // Function to truncate long product names
  const truncateProductName = (
    name: string,
    maxLength: number = 60
  ): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Business Header */}
        <View style={styles.businessHeader}>
          <View>
            <Text style={styles.businessName}>Ausi.LK</Text>
            <Text style={styles.businessTagline}>
              Your Trusted Australian Shopping Partner in Sri Lanka
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text>{order.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Order Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Order Receipt</Text>
          <Text style={styles.orderId}>Order #: {order.id}</Text>
          <Text style={styles.orderId}>
            Date: {formatDate(order.createdAt.toISOString())}
          </Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{order.name}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{order.mobile}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{order.user?.emailId || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Delivery Address</Text>
            <Text style={styles.address}>
              {order.addressLine1}
              {order.addressLine2 && `, ${order.addressLine2}`}
              {`\n${order.city}, ${order.postalCode}`}
              {`\n${order.district}`}
            </Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Delivery Method</Text>
              <Text style={styles.value}>
                {order.deliveryMethod.toUpperCase()}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Special Instructions</Text>
              <Text style={styles.value}>
                {order.comments || "No special instructions"}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Missing Items Note</Text>
              <Text style={styles.value}>
                {order.missingItems || "All items available"}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Items ({order.items.length})
          </Text>

          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, { flex: 2 }]}>
              PRODUCT DETAILS
            </Text>
            <Text
              style={[styles.headerText, { width: 60, textAlign: "center" }]}
            >
              QTY
            </Text>
            <Text
              style={[styles.headerText, { width: 80, textAlign: "right" }]}
            >
              PRICE (LKR)
            </Text>
          </View>

          {/* Order Items List */}
          {order.items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>
                  {truncateProductName(item.name)}
                </Text>
                <Text style={styles.itemMeta}>Retailer: {item.retailer}</Text>
                <Text style={styles.itemMeta}>AUD Price: ${item.price}</Text>
                <Text style={styles.itemMeta}>Item #{index + 1}</Text>
              </View>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {LkrFormat(Number(item.calculatedPrice))}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>
              Number of Items: {order.items.length}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text>GRAND TOTAL:</Text>
            <Text>{LkrFormat(Number(order.totalAmount))}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for shopping with Ausi.LK!
          </Text>
          <Text style={styles.contactInfo}>
            Email: ausilk27@gmail.com | Phone: +61 410 137 506
          </Text>
          <Text style={styles.contactInfo}>
            Website: www.ausi.lk | Follow us on social media
          </Text>
          <Text style={styles.footerSubtext}>
            If you have any questions about your order, please contact our
            customer support team.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
