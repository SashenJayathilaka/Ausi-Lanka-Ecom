import { LkrFormat } from "@/utils/format";
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

export const AusiOrderConfirmation = ({
  orderId,
  name,
  createdAt,
  totalAmount,
  addressLine1,
  addressLine2,
  city,
  postalCode,
  mobile,
  trackOrderLink,
}: {
  orderId: string;
  name: string;
  createdAt: string;
  totalAmount: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  mobile: string;
  trackOrderLink: string;
}) => {
  // Format order date
  const orderDate = new Date(createdAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format delivery address
  const deliveryAddress = `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}, ${city}, ${postalCode}`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaJvYBIP-VnArmeKBDWlGjdu-lyzqnycL0EQ&s" //TODO: Change Image Link
              width="120"
              alt="Ausi.Lk"
              style={logo}
            />
            <Heading style={heading}>Your Order is Confirmed!</Heading>
            <Text style={subHeading}>Thank you for shopping with Ausi.Lk</Text>
          </Section>

          <Hr style={hr} />

          {/* Order Summary */}
          <Section style={section}>
            <Text style={paragraph}>
              {`Hello ${name}, we've received your order`}{" "}
              <strong>#{orderId}</strong> placed on <strong>{orderDate}</strong>
              .
            </Text>

            <Text style={paragraph}>
              <strong>Order Status:</strong> Processing
            </Text>

            <Text style={paragraph}>
              <strong>Total Amount:</strong> {LkrFormat(Number(totalAmount))}
            </Text>
          </Section>

          {/* Delivery Information */}
          <Section style={section}>
            <Text style={sectionHeading}>Delivery Information</Text>
            <Text style={paragraph}>
              <strong>Delivery Address:</strong>
              <br />
              {deliveryAddress}
            </Text>
            <Text style={paragraph}>
              <strong>Contact Number:</strong> {mobile}
            </Text>
          </Section>

          {/* Track Order Button */}
          <Section style={buttonSection}>
            <Link href={trackOrderLink} style={primaryButton}>
              Track Your Order
            </Link>
            <Text style={smallText}>
              You can view your full order details on the tracking page
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Support Information */}
          <Section style={section}>
            <Text style={paragraph}>
              <strong>Need help?</strong> Contact our customer support at{" "}
              <Link href="mailto:support@ausi.lk" style={link}>
                ausilk27@gmail.com
              </Link>{" "}
              or call us at <strong>+94 776 753 242</strong>.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Ausi.Lk. All rights reserved.
            </Text>
            <Text style={footerText}>
              123 Business Street, Colombo, Sri Lanka
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles (same as previous example)
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

const sectionHeading = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#333333",
  margin: "0 0 15px",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.5",
  color: "#333333",
  margin: "0 0 15px",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const primaryButton = {
  backgroundColor: "#2563eb",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  margin: "0 0 10px 0",
};

const smallText = {
  fontSize: "13px",
  color: "#666666",
  margin: "10px 0 0",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const footer = {
  marginTop: "30px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#999999",
  margin: "5px 0",
};

export default AusiOrderConfirmation;
