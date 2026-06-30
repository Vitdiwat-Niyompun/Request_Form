// app/api/submit-k2/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // ปรับ path ให้ตรงกับไฟล์ prisma.ts ของคุณ

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formData, folio, dataFields } = body;

    // --- ส่วนที่ 1: จัดการรูปแบบวันที่ ---
    // แปลง String "2024-05-20" จากฟอร์ม ให้เป็น Object Date ของ JavaScript
    const formDate = formData.documentDate
      ? new Date(formData.documentDate)
      : null;

    // --- ส่วนที่ 2: บันทึกข้อมูลลงตาราง ReqAdmin ---
    const savedRecord = await prisma.reqAdmin.create({
      data: {
        // จับคู่ข้อมูลจากฟอร์มให้ตรงกับคอลัมน์ใน ReqAdmin
        NameReq: `${formData.nameTitle || ""}${formData.fullName || ""}`,

        // ตัดตัวอักษรให้เหลือ 10 ตัว ป้องกัน Error จาก NChar(10)
        Org: formData.departmentName
          ? formData.departmentName.substring(0, 10)
          : null,
        Position: formData.position ? formData.position.substring(0, 10) : null,
        empno: formData.employeeId
          ? formData.employeeId.substring(0, 10)
          : null,
        Location: formData.location ? formData.location.substring(0, 10) : null,

        Subject: formData.purpose, // วัตถุประสงค์ (รองรับข้อความยาว)
        Date: formDate, // วันที่ในเอกสาร
        DateReq: new Date(), // วันที่และเวลาที่กดส่งฟอร์ม (Timestamp ปัจจุบัน)

        // เช็คว่าถ้าเลือกเดินทางด้วยรถ ให้บันทึกประเภทรถ ถ้าไม่ใช่วิธีอื่นไปเลย
        Type_car:
          formData.mainTravelMode === "car"
            ? formData.carType
            : formData.mainTravelMode,
        NumberCar: formData.carPlate,
        Attached: formData.attachmentName,
      },
    });

    // --- ส่วนที่ 3: ส่งข้อมูลไป K2 (โค้ดเดิมของคุณ) ---
    const k2ApiUrl =
      "https://brbsk2app-dev.boonrawd.co.th/Api/Workflow/Preview/workflows/92";
    const username = "boonrawd_local/tn_vitdiwat";
    const password = "Next_05022548";
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const k2Response = await fetch(k2ApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        folio: folio,
        dataFields: dataFields,
      }),
    });

    if (!k2Response.ok) {
      const errorText = await k2Response.text();
      // แม้ K2 จะ Error แต่ข้อมูลถูกบันทึกลง Database ReqAdmin ไปแล้ว
      return NextResponse.json(
        { message: `K2 Error: ${k2Response.status} - ${errorText}` },
        { status: k2Response.status },
      );
    }

    return NextResponse.json(
      { success: true, recordId: savedRecord.id },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
