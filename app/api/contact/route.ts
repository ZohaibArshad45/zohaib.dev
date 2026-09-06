import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      projectType,
      timeline,
      details,
    } = body;

    if (
      !name ||
      !email ||
      !projectType ||
      !timeline ||
      !details
    ) {
      return NextResponse.json(
        {
          message: "Please complete all fields.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Zohaib Portfolio <onboarding@resend.dev>",

      to: ["zohaibfta@gmail.com"],

      replyTo: email,

      subject: `New project inquiry from ${name}`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            padding: 30px;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 10px;
            "
          >
            <h1
              style="
                font-size: 24px;
                margin-top: 0;
              "
            >
              New Project Inquiry
            </h1>

            <p>
              Someone contacted you through your portfolio.
            </p>

            <hr
              style="
                border: 0;
                border-top: 1px solid #eeeeee;
                margin: 25px 0;
              "
            />

            <p>
              <strong>Name</strong>
              <br />
              ${escapeHtml(name)}
            </p>

            <p>
              <strong>Email</strong>
              <br />
              ${escapeHtml(email)}
            </p>

            <p>
              <strong>Project Type</strong>
              <br />
              ${escapeHtml(projectType)}
            </p>

            <p>
              <strong>Timeline</strong>
              <br />
              ${escapeHtml(timeline)}
            </p>

            <p>
              <strong>Project Details</strong>
            </p>

            <div
              style="
                background: #f5f5f5;
                padding: 16px;
                border-radius: 6px;
                line-height: 1.6;
                white-space: pre-wrap;
              "
            >
              ${escapeHtml(details)}
            </div>

            <p
              style="
                margin-top: 30px;
                color: #777777;
                font-size: 12px;
              "
            >
              Zohaib Portfolio
              <br />
              Web Developer & AI Builder
              <br />
              Founder of Codingskillup
              <br />
              Bahawalpur, Punjab, Pakistan
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          message: "Email could not be sent.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}