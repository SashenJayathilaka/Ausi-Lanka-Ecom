import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const AusiNewOrderNotification = ({
  orderId,
  orderDate,
  orderLink,
  customerMobile,
}: {
  orderId: string;
  orderDate: string;
  orderLink: string;
  customerMobile: string;
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaJvYBIP-VnArmeKBDWlGjdu-lyzqnycL0EQ&s" //TODO: Change Image Link
            width="150"
            alt="Ausi.Lk"
            style={logo}
          />
          <Heading style={heading}>🛒 New Order Received</Heading>
          <Text style={subHeading}>Ausi.Lk Order Notification</Text>
        </Section>

        <Hr style={hr} />

        {/* Order Details */}
        <Section style={section}>
          <Text style={label}>Order ID:</Text>
          <Text style={value}>{orderId}</Text>

          <Text style={label}>Order Date:</Text>
          <Text style={value}>{orderDate}</Text>

          <Text style={label}>Customer Mobile:</Text>
          <Text style={value}>{customerMobile}</Text>
        </Section>

        {/* Action Button */}
        <Section style={section}>
          <Link href={orderLink} style={button}>
            View Order Details
          </Link>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            This is an automated notification. Please check the order in your
            admin dashboard.
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Ausi.Lk. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "30px",
};

const header = {
  marginBottom: "20px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto 20px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#333333",
  margin: "0 0 10px",
};

const subHeading = {
  fontSize: "16px",
  color: "#666666",
  margin: "0",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "20px 0",
};

const section = {
  marginBottom: "20px",
};

const label = {
  fontSize: "14px",
  color: "#666666",
  margin: "0 0 5px",
};

const value = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333333",
  margin: "0 0 15px",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
};

const footer = {
  marginTop: "20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#999999",
  margin: "5px 0",
};
