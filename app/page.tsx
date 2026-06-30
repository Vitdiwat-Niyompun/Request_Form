"use client";

import React, { useState } from "react";

export default function OffsiteWorkForm() {
  const [formData, setFormData] = useState({
    company: "",
    documentDate: "",
    nameTitle: "",
    fullName: "",
    departmentType: "",
    departmentName: "",
    employeeId: "",
    assignedBy: "",
    location: "",
    purpose: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    mainTravelMode: "",
    carType: "",
    carPlate: "",
    trainType: "",
    airlineName: "",
    flightClass: "",
  });

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      // 1. เรียกใช้งานผ่าน API Route ใน Next.js ของเราเอง (แก้ปัญหา CORS)
      const internalApiUrl = "/api/submit-k2";

      // app/page.tsx (บางส่วน)
      const response = await fetch(internalApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 1. ส่งข้อมูลฟอร์มทั้งหมดไปให้ Backend บันทึกลง Database
          formData: {
            ...formData,
          },
          // 2. ข้อมูลสำหรับส่งให้ K2
          folio: `OffsiteWork-${formData.employeeId}-${Date.now()}`,
          dataFields: {},
        }),
      });

      // 3. ดักจับ Error ที่ Backend เราส่งกลับมา
      if (!response.ok) {
        const errorDetail = await response.json().catch(() => ({}));
        throw new Error(errorDetail.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }

      setSubmitStatus("success");
    } catch (error: any) {
      console.error("Submit Error:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error.message || "เกิดข้อผิดพลาดบางอย่าง ไม่สามารถส่งข้อมูลได้",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        {/* --- Notification Banner --- */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md text-center font-bold">
            🎉 ข้อมูลของคุณถูกส่งเข้าสู่ระบบ K2 เรียบร้อยแล้ว!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center font-bold">
            ❌ {errorMessage}
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            ใบแจ้งปฏิบัติงานนอกสถานที่
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-sm text-gray-700"
        >
          {/* --- Company & Date --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-max">บริษัท:</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
                placeholder="บุญรอดบริวเวอรี่ จำกัด"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-max">วันที่:</label>
              <input
                type="date"
                name="documentDate"
                value={formData.documentDate}
                onChange={handleChange}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
              />
            </div>
          </div>

          {/* --- Employee Details --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="font-semibold min-w-max">ข้าพเจ้า:</label>
              <select
                name="nameTitle"
                value={formData.nameTitle}
                onChange={handleChange}
                className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <select
                name="departmentType"
                value={formData.departmentType}
                onChange={handleChange}
                className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">เลือกประเภทหน่วยงาน</option>
                <option value="ฝ่าย">ฝ่าย</option>
                <option value="แผนก">แผนก</option>
                <option value="หน่วย">หน่วย</option>
              </select>
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
                placeholder="ชื่อหน่วยงาน"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-max">รหัสพนักงาน:</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-max">
                ได้รับคำสั่งจาก:
              </label>
              <input
                type="text"
                name="assignedBy"
                value={formData.assignedBy}
                onChange={handleChange}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
              />
            </div>
          </div>

          {/* --- Work Details --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-max">
                ปฏิบัติงานที่(สถานที่):
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="flex-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold min-w-max">เพื่อ(งาน):</label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="flex-1 border-b border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
              />
            </div>
          </div>

          {/* --- Timeframe --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 p-4 rounded-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="font-semibold min-w-max">ตั้งแต่วันที่:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full sm:w-auto border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 px-2 py-1"
              />
              <label className="font-semibold min-w-max">เวลา:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full sm:w-auto border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 px-2 py-1"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="font-semibold min-w-max">ถึงวันที่:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full sm:w-auto border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 px-2 py-1"
              />
              <label className="font-semibold min-w-max">เวลา:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full sm:w-auto border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 px-2 py-1"
              />
            </div>
          </div>

          {/* --- Travel Mode --- */}
          <div className="border border-gray-300 rounded-md p-4 space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">
              เดินทางโดย
            </h3>

            {/* CAR */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="mainTravelMode"
                  value="car"
                  checked={formData.mainTravelMode === "car"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                รถยนต์
              </label>
              {formData.mainTravelMode === "car" && (
                <div className="ml-6 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="carType"
                      value="company"
                      onChange={handleChange}
                      checked={formData.carType === "company"}
                    />
                    รถบริษัท เลขทะเบียน:
                    <input
                      type="text"
                      name="carPlate"
                      disabled={formData.carType !== "company"}
                      onChange={handleChange}
                      className="border-b border-gray-400 focus:outline-none px-2 py-1 ml-2 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="carType"
                      value="personal"
                      onChange={handleChange}
                      checked={formData.carType === "personal"}
                    />
                    รถส่วนตัว เลขทะเบียน:
                    <input
                      type="text"
                      name="carPlate"
                      disabled={formData.carType !== "personal"}
                      onChange={handleChange}
                      className="border-b border-gray-400 focus:outline-none px-2 py-1 ml-2 disabled:opacity-50"
                      placeholder="เช่น กพ 1808"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="carType"
                      value="bus"
                      onChange={handleChange}
                      checked={formData.carType === "bus"}
                    />
                    รถทัวร์ปรับอากาศ
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="carType"
                      value="taxi"
                      onChange={handleChange}
                      checked={formData.carType === "taxi"}
                    />
                    รถรับจ้าง/รถแท็กซี่
                  </label>
                </div>
              )}
            </div>

            {/* TRAIN */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="mainTravelMode"
                  value="train"
                  checked={formData.mainTravelMode === "train"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                รถไฟ
              </label>
              {formData.mainTravelMode === "train" && (
                <div className="ml-6 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trainType"
                      value="express1"
                      onChange={handleChange}
                      checked={formData.trainType === "express1"}
                    />
                    ด่วนพิเศษชั้น 1
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trainType"
                      value="express2"
                      onChange={handleChange}
                      checked={formData.trainType === "express2"}
                    />
                    ด่วนพิเศษชั้น 2
                  </label>
                </div>
              )}
            </div>

            {/* AIRPLANE */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="mainTravelMode"
                  value="airplane"
                  checked={formData.mainTravelMode === "airplane"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                เครื่องบิน สายการบิน:
                <input
                  type="text"
                  name="airlineName"
                  value={formData.airlineName}
                  onChange={handleChange}
                  disabled={formData.mainTravelMode !== "airplane"}
                  className="border-b border-gray-400 focus:outline-none px-2 py-1 ml-2 disabled:opacity-50 font-normal"
                />
              </label>
              {formData.mainTravelMode === "airplane" && (
                <div className="ml-6 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="flightClass"
                      value="first"
                      onChange={handleChange}
                      checked={formData.flightClass === "first"}
                    />
                    ชั้น First class
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="flightClass"
                      value="business"
                      onChange={handleChange}
                      checked={formData.flightClass === "business"}
                    />
                    ชั้น Business Class
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="flightClass"
                      value="economy"
                      onChange={handleChange}
                      checked={formData.flightClass === "economy"}
                    />
                    ชั้น Economy Class
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* --- Submit Button --- */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitStatus === "loading"}
              className={`font-bold py-2 px-6 rounded shadow transition-colors duration-200 
                ${
                  submitStatus === "loading"
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {submitStatus === "loading"
                ? "กำลังบันทึกข้อมูล..."
                : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
