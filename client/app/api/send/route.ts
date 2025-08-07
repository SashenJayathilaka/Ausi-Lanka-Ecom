import AusiOrderConfirmation from "@/components/email/ausi-order-confirmation";
import { AusiNewOrderNotification } from "@/components/email/email-template";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { emailType, recipient, orderData } = await req.json();

    // Validate required fields
    if (!emailType || !recipient) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: emailType and recipient are required",
        },
        { status: 400 }
      );
    }

    if (!orderData?.orderId || !orderData?.createdAt) {
      return NextResponse.json(
        {
          error:
            "Missing required order data: orderId and createdAt are required",
        },
        { status: 400 }
      );
    }

    let emailTemplate;
    let subject;
    let fromEmail;

    switch (emailType) {
      case "customer-confirmation":
        if (!orderData.name || !orderData.totalAmount || !orderData.mobile) {
          return NextResponse.json(
            { error: "Missing required customer data" },
            { status: 400 }
          );
        }

        emailTemplate = AusiOrderConfirmation({
          orderId: orderData.orderId,
          name: orderData.name,
          createdAt: orderData.createdAt,
          totalAmount: orderData.totalAmount,
          addressLine1: orderData.addressLine1 || "Not specified",
          addressLine2: orderData.addressLine2 || "",
          city: orderData.city || "Not specified",
          postalCode: orderData.postalCode || "Not specified",
          mobile: orderData.mobile,
          trackOrderLink: `${process.env.NEXT_PUBLIC_APP_URL}/history`,
        });
        subject = `Your Ausi.Lk Order #${orderData.orderId}`;
        fromEmail = "Ausi.lk <noreply@ausi.shop>";
        break;

      case "internal-notification":
        emailTemplate = AusiNewOrderNotification({
          orderId: orderData.orderId,
          orderDate: new Date(orderData.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          orderLink: `${process.env.NEXT_PUBLIC_APP_URL}/admin/${orderData.orderId}`,
          customerMobile: orderData.mobile || "Not provided",
        });
        subject = `[Internal] New Order #${orderData.orderId}`;
        fromEmail = "Ausi.lk <noreply@ausi.shop>";
        break;

      default:
        return NextResponse.json(
          {
            error:
              "Invalid email type. Use 'customer-confirmation' or 'internal-notification'",
          },
          { status: 400 }
        );
    }

    // Validate email template was created
    if (!emailTemplate) {
      return NextResponse.json(
        { error: "Failed to generate email template" },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: subject,
      html: await render(emailTemplate),
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log(`Successfully sent ${emailType} email to ${recipient}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Email sending failed:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Internal server error",
        details: message,
      },
      { status: 500 }
    );
  }
}
